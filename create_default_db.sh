#!/bin/bash

sleep 5
python manage.py makemigrations -v 2 --settings=settings.test_settings
python manage.py migrate -v 2 --settings=settings.test_settings
python manage.py collectstatic --noinput > /dev/null && \
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin')"