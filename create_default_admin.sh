#!/bin/bash

python manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin')"
printf "admin: admin\nadmin_email: admin@example.com\n" >> /appCurie/data/settings/config.yml