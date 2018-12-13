#!/bin/bash

yarn
mkdir -p data/db
mkdir -p data/media
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
