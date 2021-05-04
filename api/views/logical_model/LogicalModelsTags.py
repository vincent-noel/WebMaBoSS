from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, NotFound, MethodNotAllowed

from django.http import FileResponse
from django.conf import settings
from django.core.files import File

from api.models import LogicalModel, Project, TaggedLogicalModel
from api.views.HasModel import HasModel

from os.path import join, basename, splitext
from shutil import copyfile

import ginsim


class LogicalModelsTags(HasModel):

	def get(self, request, project_id, model_id, tag=None):

		HasModel.load(self, request, project_id, model_id)

		try:
			if tag is None:
				tagged_models = TaggedLogicalModel.objects.filter(model=self.model)
				tags = [tagged_model.tag for tagged_model in tagged_models]

				return Response(tags)

			else:
				# Restoring model from tag
				tagged_model = TaggedLogicalModel.objects.get(model=self.model, tag=tag)

				# TODO : Which format fo we want ? which format do we have
				copyfile(
					join(settings.MEDIA_ROOT, tagged_model.file.path),
					join(settings.MEDIA_ROOT, self.model.file.path)
				)

				return Response(status=status.HTTP_200_OK)

		except TaggedLogicalModel.DoesNotExist:
			raise NotFound

	def post(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		if self.model.format == LogicalModel.ZGINML:
			TaggedLogicalModel(
				model=self.model,
				tag=str(request.POST['tag']),
				file=File(open(join(settings.MEDIA_ROOT, self.model.file.path), 'rb'), name=basename(self.model.file.path)),
			).save()

		elif self.model.format == LogicalModel.MABOSS:
			TaggedLogicalModel(
				model=self.model,
				tag=str(request.POST['tag']),
				bnd_file=File(open(join(settings.MEDIA_ROOT, self.model.bnd_file.path), 'rb'), name=basename(self.model.bnd_file.path)),
				cfg_file=File(open(join(settings.MEDIA_ROOT, self.model.cfg_file.path), 'rb'), name=basename(self.model.cfg_file.path))
			).save()

		else:
			raise MethodNotAllowed

		return Response(status=status.HTTP_200_OK)


	def delete(self, request, project_id, model_id, tag):

		HasModel.load(self, request, project_id, model_id)

		try:
			tagged_model = TaggedLogicalModel.objects.get(model=self.model, tag=tag)
			tagged_model.delete()

		except TaggedLogicalModel.DoesNotExist:
			raise NotFound

		return Response(status=status.HTTP_200_OK)


class TaggedLogicalModelFile(HasModel):

	def get(self, request, project_id, model_id, tag):

		HasModel.load(self, request, project_id, model_id)

		try:
			tagged_version = TaggedLogicalModel.objects.get(model=self.model, tag=tag)

			return FileResponse(
				open(join(settings.MEDIA_ROOT, tagged_version.file.path), 'rb'),
				as_attachment=True, filename=basename(tagged_version.file.path)
			)

		except TaggedLogicalModel.DoesNotExist:
			raise NotFound



class TaggedLogicalModelSBMLFile(HasModel):

	def get(self, request, project_id, model_id, tag):

		HasModel.load(self, request, project_id, model_id)

		try:
			tagged_version = TaggedLogicalModel.objects.get(model=self.model, tag=tag)

			ginsim_model = ginsim.load(join(settings.MEDIA_ROOT, tagged_version.file.path))

			sbml_filename = join(settings.TMP_ROOT, splitext(basename(tagged_version.file.path))[0] + ".sbml")
			biolqm.save(ginsim_model, sbml_filename, "sbml")

			return FileResponse(
				open(sbml_filename, 'rb'),
				as_attachment=True, filename=basename(sbml_filename)
			)

		except TaggedLogicalModel.DoesNotExist:
			raise NotFound
