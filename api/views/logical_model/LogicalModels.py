from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, NotFound

from api.models import LogicalModel
from api.serializers import LogicalModelSerializer
from api.views.HasProject import HasProject

from urllib.request import urlretrieve
import os, tempfile, shutil, biolqm, re
from django.core.files import File
import zipfile

def sbml_to_maboss(path):
	print("Converting %s to maboss" % path)
	biolqm_model = biolqm.load(path)
	for component in biolqm_model.getComponents():
		if component.getName() != "":
			
			component.setNodeID(re.sub('[^A-Za-z0-9_]+', '', component.getName()))
			
	maboss_model = biolqm.to_maboss(biolqm_model)
	
	bnd_file = tempfile.mkstemp(suffix=".bnd")
	cfg_file = tempfile.mkstemp(suffix=".cfg")
	os.close(bnd_file[0])
	os.close(cfg_file[0])
	maboss_model.print_bnd(open(bnd_file[1], 'w'))
	maboss_model.print_cfg(open(cfg_file[1], 'w'))
	return (bnd_file[1], cfg_file[1])

class LogicalModels(HasProject):

	def get(self, request, project_id, model_id=None):

		HasProject.load(self, request, project_id)

		try:
			if model_id is None:

				models = LogicalModel.objects.filter(
					project=self.project
				)
				serializer = LogicalModelSerializer(models, many=True)

				return Response(serializer.data)

			else:
				model = LogicalModel.objects.get(id=model_id)

				if model.project != self.project:
					raise PermissionDenied

				serializer = LogicalModelSerializer(model)

				return Response(serializer.data)

		except LogicalModel.DoesNotExist:
			raise NotFound


	def post(self, request, project_id):

		HasProject.load(self, request, project_id)
		
		if 'url' in request.data.keys():
			print(request.data['url'])
			if request.data['url'].startswith("https://www.ebi.ac.uk"):
				zip_filename = tempfile.mkstemp(suffix=".zip")
				os.close(zip_filename[0])
				urlretrieve(request.data['url'], zip_filename[1])
				with zipfile.ZipFile(zip_filename[1],'r') as zip_file:
					
					temp_dir = tempfile.mkdtemp()
					zip_file.extract(zip_file.namelist()[0], temp_dir)
					(bnd_file, cfg_file) = sbml_to_maboss(os.path.join(temp_dir, zip_file.namelist()[0]))
					
					new_model = LogicalModel(
						project=self.project,
						name=request.data['name'],
						bnd_file=File(open(bnd_file, 'rb')),
						cfg_file=File(open(cfg_file, 'rb')),
						format=LogicalModel.MABOSS
					).save()
					os.remove(bnd_file)
					os.remove(cfg_file)
					shutil.rmtree(temp_dir)
				os.remove(zip_filename[1])
				
			else:
				
				sbml_file = tempfile.mkstemp(suffix=".sbml")
				os.close(sbml_file[0])
				urlretrieve(request.data['url'], sbml_file[1])
				(bnd_file, cfg_file) = sbml_to_maboss(sbml_file[1])
				
				
				new_model = LogicalModel(
					project=self.project,
					name=request.data['name'],
					bnd_file=File(open(bnd_file, 'rb')),
					cfg_file=File(open(cfg_file, 'rb')),
					format=LogicalModel.MABOSS
				).save()
				os.remove(bnd_file)
				os.remove(cfg_file)
				os.remove(sbml_file[1])
			
		elif 'file2' in request.data.keys():
			LogicalModel(
				project=self.project,
				name=request.data['name'],
				bnd_file=request.data['file'],
				cfg_file=request.data['file2'],
				format=LogicalModel.MABOSS
			).save()

		else:
			LogicalModel(
				project=self.project,
				name=request.data['name'],
				file=request.data['file'],
				format=LogicalModel.ZGINML
			).save()

		return Response(status=status.HTTP_200_OK)


	def delete(self, request, project_id, model_id):

		HasProject.load(self, request, project_id)

		try:
			model = LogicalModel.objects.get(id=model_id)

			if model.project != self.project:
				raise PermissionDenied

			model.delete()

		except LogicalModel.DoesNotExist:
			raise NotFound

		return Response(status=status.HTTP_200_OK)
