FROM colomoto/colomoto-docker:2018-08-17
MAINTAINER Vincent Noel <contact@vincent-noel.fr>

USER root
WORKDIR /appCurie

RUN apt-get -qq update \
    && apt-get install -y python3 python3-pip curl software-properties-common nano git apt-transport-https \
                          apache2 apache2-dev \
                          libgl1-mesa-glx

RUN \
    # Yarn sources
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    # Node sources
    && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs yarn

# Updating pip
RUN pip install pip --upgrade \
    && pip install setuptools --upgrade \
    && easy_install -U distribute \
    && pip install --upgrade django djangorestframework django-rest-auth[with_social] \
                             coreapi mod_wsgi \
                             git+https://github.com/vincent-noel/GINsim-python.git \
                             git+https://github.com/vincent-noel/pyMaBoSS.git

ADD . .

# Removing node modules, downloading them from scratch, and transpiling the JSX
RUN rm -fr node_modules/* yarn.lock; yarn && \
                  npm run build && \
                  rm -fr node_modules/ docker/ 

# Removing old db and medias, creating a new one, with default user admin:admin
RUN rm -fr data/; mkdir -p data/media; mkdir -p data/db; python manage.py makemigrations --noinput && \
                  python manage.py migrate --noinput && \
                  python manage.py collectstatic --noinput > /dev/null && \
                  python manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin')"

# Removing old server, and creating it from scratch
RUN rm -fr server/; python manage.py runmodwsgi --setup-only \
                                --host 0.0.0.0 --port 8000 \
                                --user www-data --group www-data \
                                --server-root=server/ \
                                --settings=settings.prod_settings \
                                --url-alias /static static/ \
                                --url-alias /data/media media/ \
                                --reload-on-changes

RUN chown -R www-data:www-data settings data server;

# Exposing port 8000 for server access
EXPOSE 8000

# Switching to apache user
USER www-data

# Running server
ENTRYPOINT /appCurie/server/apachectl -D FOREGROUND