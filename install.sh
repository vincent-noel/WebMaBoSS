#!/bin/bash

echo ">> Downloading JS dependencies"
yarn >/dev/null

echo ">> Initializing database"
mkdir -p data/db
mkdir -p data/media
python manage.py makemigrations > /dev/null
python manage.py migrate > /dev/null

echo ">> Creating super user"
python manage.py createsuperuser
