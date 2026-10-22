"""
Checks that the data already stored in a WebMaBoSS database (models, simulation
results, sensitivity analyses) can still be read after an upgrade.

It reads a fixed sample of existing objects through the API, as their owner,
and writes a snapshot in the same format as api_smoke.py. It runs inside the
application container, on a copy of the production database and media:

    python3 manage.py shell < tests/smoke/existing_data.py

The snapshot path is given by the SNAPSHOT environment variable. Snapshots are
compared with api_smoke.py:

    api_smoke.py --load new.json --compare ref1.json ref2.json

Only use it on a copy of the data : some GET requests write files (layouts).
"""

import hashlib
import json
import os
import random
import sys

from rest_framework.test import APIClient

from api.models import LogicalModel, MaBoSSSimulation, MaBoSSSensitivityAnalysis

sys.path.insert(0, os.path.dirname(os.path.abspath(os.environ.get("SMOKE_DIR", "/src/tests/smoke/x"))))
from api_smoke import Smoke, sort_unordered

# Bodies bigger than that are only stored as a hash
MAX_BODY = 100000

sampler = random.Random(0)


def sample(queryset, n):
	ids = sorted(queryset.values_list("id", flat=True))
	return sorted(sampler.sample(ids, min(n, len(ids))))


records = {}


def get(step, user, path):
	client = APIClient(raise_request_exception=False)
	client.force_authenticate(user=user)
	response = client.get(path)
	if response.status_code >= 500:
		body = {"error": "%d" % response.status_code}
	elif "json" in response.get("Content-Type", ""):
		body = json.loads(response.content)
	elif response.streaming:
		body = {"sha256": hashlib.sha256(b"".join(response.streaming_content)).hexdigest()}
	else:
		body = {"sha256": hashlib.sha256(response.content).hexdigest()}

	record = sort_unordered(step, {"status": response.status_code, "body": body})
	text = json.dumps(record["body"], sort_keys=True)
	if len(text) > MAX_BODY:
		record["body"] = {"sha256": hashlib.sha256(text.encode()).hexdigest(), "size": len(text)}
	records[step] = record


# Models : every format other than MaBoSS is rare, they are all included
model_ids = sample(LogicalModel.objects.filter(format=LogicalModel.MABOSS), 40)
model_ids += sorted(LogicalModel.objects.exclude(format=LogicalModel.MABOSS).values_list("id", flat=True))

for model in LogicalModel.objects.filter(id__in=model_ids).select_related("project__user"):
	user, project = model.project.user, model.project
	files = "/api/logical_models/%d/%d" % (project.id, model.id)
	api = "/api/logical_model/%d/%d" % (project.id, model.id)
	name = "model %d (%s)" % (model.id, model.format)

	get("%s model" % name, user, files)
	for endpoint in ["file", "sbmlfile", "bndfile", "cfgfile", "bnetfile"]:
		get("%s %s" % (name, endpoint), user, "%s/%s" % (files, endpoint))
	for endpoint in ["name", "nodes", "graph_raw", "formulas", "parameters", "initial_states",
					 "outputs", "settings", "maboss/settings/", "steady_states", "maboss", "maboss_sensitivity"]:
		get("%s %s" % (name, endpoint), user, "%s/%s" % (api, endpoint))

# Simulations : mostly finished ones, and a few failed or interrupted
simulation_ids = sample(MaBoSSSimulation.objects.filter(status=MaBoSSSimulation.ENDED), 50)
simulation_ids += sample(MaBoSSSimulation.objects.exclude(status=MaBoSSSimulation.ENDED), 5)

for simulation in MaBoSSSimulation.objects.filter(id__in=simulation_ids).select_related("project__user"):
	user, project = simulation.project.user, simulation.project
	api = "/api/maboss/%d/%d" % (project.id, simulation.id)
	name = "simulation %d (%s)" % (simulation.id, simulation.status)

	for endpoint in ["status", "fixed_points/", "last_states/", "states_trajs/", "nodes_trajs/",
					 "pca", "sspca", "bnd_file", "cfg_file"]:
		get("%s %s" % (name, endpoint), user, "%s/%s" % (api, endpoint))

# Sensitivity analyses
for analysis in MaBoSSSensitivityAnalysis.objects.filter(
	id__in=sample(MaBoSSSensitivityAnalysis.objects.all(), 15)
).select_related("project__user"):
	user, project = analysis.project.user, analysis.project
	api = "/api/maboss_sensitivity/%d/%d" % (project.id, analysis.id)
	name = "sensitivity %d" % analysis.id

	for endpoint in ["status", "steady_states/"]:
		get("%s %s" % (name, endpoint), user, "%s/%s" % (api, endpoint))

with open(os.environ["SNAPSHOT"], "w") as f:
	json.dump(records, f, indent=1, sort_keys=True)

statuses = {}
for record in records.values():
	statuses[record["status"]] = statuses.get(record["status"], 0) + 1
print("%d requests, status codes : %s" % (len(records), statuses))
