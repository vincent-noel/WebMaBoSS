#!/bin/bash

sleep 5
python manage.py makemigrations api -v 2 "$@"
python manage.py migrate -v 2 "$@"
python manage.py collectstatic --noinput "$@" > /dev/null
printf "secret_key: fwhfiewqhfiquwehfduihwq\nallowed_hosts: ['*']\n" > /appCurie/config.yml