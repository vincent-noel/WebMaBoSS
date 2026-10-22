#!/bin/bash

# Migrations are committed in the repository, they must never be generated in production.
# This only warns if the models and the migrations are out of sync.
/opt/conda/bin/python3 manage.py makemigrations api --check --dry-run "$@" || echo "WARNING: api models have changes without migrations"
/opt/conda/bin/python3 manage.py migrate -v 2 "$@"
/opt/conda/bin/python3 manage.py collectstatic --noinput "$@" > /dev/null
if [ ! -f /var/webmaboss/data/settings/config.yml ]; then
  random_string=`head /dev/urandom | tr -dc A-Za-z0-9 | head -c 24`
  printf "secret_key: %s\nallowed_hosts: ['*']\n" "$random_string"> /var/webmaboss/data/settings/config.yml
fi