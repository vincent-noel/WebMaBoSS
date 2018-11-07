import maboss, biolqm, ginsim
from django.conf import settings
from os.path import join
import tempfile


def maboss_to_biolqm(model):
	maboss_sim = maboss.load(join(settings.MEDIA_ROOT, model.bnd_file.path),
							 join(settings.MEDIA_ROOT, model.cfg_file.path))

	path = tempfile.mkdtemp()
	tmp_bnet = tempfile.mkstemp(dir=path, suffix='.bnet')[1]

	with open(tmp_bnet, "w") as bnet_file:
		maboss_sim.print_logical_rules(bnet_file)

	f = open(tmp_bnet, "r")
	string = f.readlines()
	new_string = [line.replace(" : ", ", ") for line in string]
	f.close()

	f = open(tmp_bnet, "w")
	f.write("targets, factors\n")
	f.writelines(new_string)
	f.close()
	blqm_model = biolqm.load(tmp_bnet)

	return blqm_model

def maboss_to_ginsim(model):

	blqm_model = maboss_to_biolqm(model)

	ginsim_model = biolqm.to_ginsim(blqm_model)
	ginsim.layout(ginsim_model, 2)

	return ginsim_model

def ginsim_to_maboss(model):
	ginsim_model = ginsim.load(model.file.path)
	return ginsim.to_maboss(ginsim_model)