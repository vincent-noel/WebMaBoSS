import maboss, biolqm, ginsim
from django.conf import settings
from os.path import join

def maboss_to_biolqm(model):
	maboss_sim = maboss.load(join(settings.MEDIA_ROOT, model.bnd_file.path),
							 join(settings.MEDIA_ROOT, model.cfg_file.path))
	maboss_sim.print_logical_rules(join(settings.TMP_ROOT, "model.bnet"))
	f = open(join(settings.TMP_ROOT, "model.bnet"), "r")
	string = f.readlines()
	new_string = [line.replace(" : ", ", ") for line in string]
	f.close()

	f = open(join(settings.TMP_ROOT, "model.bnet"), "w")
	f.write("targets, factors\n")
	f.writelines(new_string)
	f.close()
	blqm_model = biolqm.load(join(settings.TMP_ROOT, "model.bnet"))
	return blqm_model

def maboss_to_ginsim(model):

	blqm_model = maboss_to_biolqm(model)
	ginsim_model = biolqm.to_ginsim(blqm_model)
	ginsim.layout(ginsim_model, 2)

	return ginsim_model