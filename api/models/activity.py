from django.contrib.auth.models import User
from django.contrib.auth.signals import user_logged_in
from django.core.cache import cache
from django.db import models
from django.utils import timezone


class UserActivity(models.Model):
	""" The days on which a user used WebMaBoSS : one row per user and day """

	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activity")
	day = models.DateField(db_index=True)

	class Meta:
		constraints = [models.UniqueConstraint(fields=["user", "day"], name="unique_user_activity_day")]


def record_activity(user):
	""" Records that the user is active today. The cache avoids a query for each request """

	if user is None or not user.is_authenticated:
		return

	today = timezone.localdate()
	key = "activity-%d-%s" % (user.id, today.isoformat())
	if cache.get(key) is None:
		UserActivity.objects.get_or_create(user=user, day=today)
		cache.set(key, True, 60 * 60 * 25)


def record_login(sender, request, user, **kwargs):
	record_activity(user)


user_logged_in.connect(record_login, dispatch_uid="record_login_activity")


def estimate_past_activity(user_model, activity_model, simulation_model, analysis_model, ignore_before=None):
	"""
	Fills the activity of the past, before it was recorded : the days users registered, last logged in, and
	created simulations or sensitivity analyses. Browsing without creating anything leaves no trace, so it's an
	underestimate. The models are given, so that it can run in a migration.

	ignore_before : creation dates before it are not activity, but the date the column was added
	"""
	days = set()

	for user_id, date_joined, last_login in user_model.objects.values_list("id", "date_joined", "last_login"):
		days.add((user_id, date_joined.date()))
		if last_login is not None:
			days.add((user_id, last_login.date()))

	for model in (simulation_model, analysis_model):
		created = model.objects.values_list("project__user_id", "created_at")
		if ignore_before is not None:
			created = created.filter(created_at__gt=ignore_before)
		for user_id, created_at in created:
			days.add((user_id, created_at.date()))

	activity_model.objects.bulk_create(
		[activity_model(user_id=user_id, day=day) for user_id, day in days],
		batch_size=1000, ignore_conflicts=True
	)
