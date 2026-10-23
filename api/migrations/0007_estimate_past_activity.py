from datetime import timedelta

from django.db import migrations
from django.db.migrations.recorder import MigrationRecorder

from api.models.activity import estimate_past_activity


def estimate(apps, schema_editor):
	# The simulations and analyses older than migration 0005 got the date it was applied as creation date
	applied = MigrationRecorder.Migration.objects.using(schema_editor.connection.alias).filter(
		app="api", name="0005_auto_20211015_1244"
	).values_list("applied", flat=True).first()

	estimate_past_activity(
		apps.get_model("auth", "User"),
		apps.get_model("api", "UserActivity"),
		apps.get_model("api", "MaBoSSSimulation"),
		apps.get_model("api", "MaBoSSSensitivityAnalysis"),
		ignore_before=applied + timedelta(minutes=1) if applied is not None else None,
	)


class Migration(migrations.Migration):

	dependencies = [
		('api', '0006_useractivity'),
	]

	operations = [
		migrations.RunPython(estimate, migrations.RunPython.noop),
	]
