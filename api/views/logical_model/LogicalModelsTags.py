from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied

from django.http import Http404, FileResponse
from django.conf import settings
from django.core.files import File

from api.models import LogicalModel, Project, TaggedLogicalModel
from os.path import join, basename, splitext
from shutil import copyfile


class LogicalModelsTags(APIView):

	def get(self, request, project_id, model_id, tag=None):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)

			if project.user != request.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(project=project, id=model_id)

			if tag is None:
				tagged_models = TaggedLogicalModel.objects.filter(model=model)
				tags = [tagged_model.tag for tagged_model in tagged_models]

				return Response(tags)

			else:
				# Restoring model from tag
				tagged_model = TaggedLogicalModel.objects.get(model=model, tag=tag)
				copyfile(
					join(settings.MEDIA_ROOT, tagged_model.file.path),
					join(settings.MEDIA_ROOT, model.file.path)
				)

				return Response(status=status.HTTP_200_OK)

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404


	def post(self, request, project_id, model_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)

			if project.user != request.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(project=project, id=model_id)

			TaggedLogicalModel(
				model=model,
				tag=str(request.POST['tag']),
				file=File(open(join(settings.MEDIA_ROOT, model.file.path), 'rb'))
			).save()

			return Response(status=status.HTTP_200_OK)

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404


	def delete(self, request, project_id, model_id, tag):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)

			if project.user != request.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(
				project=project,
				id=model_id
			)

			tagged_model = TaggedLogicalModel.objects.get(model=model, tag=tag)
			tagged_model.delete()

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404

		except TaggedLogicalModel.DoesNotExist:
			raise Http404

		return Response(status=status.HTTP_200_OK)

class TaggedLogicalModelFile(APIView):

	def get(self, request, project_id, model_id, tag):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)

			if project.user != request.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(project=project, id=model_id)
			tagged_version = TaggedLogicalModel.objects.get(model=model, tag=tag)

			return FileResponse(
				open(join(settings.MEDIA_ROOT, tagged_version.file.path), 'rb'),
				as_attachment=True, filename=basename(tagged_version.file.path)
			)

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404

		except TaggedLogicalModel.DoesNotExist:
			raise Http404



class TaggedLogicalModelSBMLFile(APIView):

	def get(self, request, project_id, model_id, tag):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)

			if project.user != request.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(project=project, id=model_id)
			tagged_version = TaggedLogicalModel.objects.get(model=model, tag=tag)

			import ginsim
			ginsim_model = ginsim.load(join(settings.MEDIA_ROOT, tagged_version.file.path))

			sbml_filename = join(settings.TMP_ROOT, splitext(basename(tagged_version.file.path))[0] + ".sbml")
			ginsim.to_sbmlqual(ginsim_model, sbml_filename)

			return FileResponse(
				open(sbml_filename, 'rb'),
				as_attachment=True, filename=basename(sbml_filename)
			)

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404

		except TaggedLogicalModel.DoesNotExist:
			raise Http404
