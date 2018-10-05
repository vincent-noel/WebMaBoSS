FROM colomoto/colomoto-docker:2018-08-17
MAINTAINER Vincent Noel <contact@vincent-noel.fr>

USER root
WORKDIR /appCurie

RUN apt-get -qq update \
    && apt-get install -y python3 python3-pip curl software-properties-common nano git apt-transport-https \
                          apache2 apache2-dev

RUN \
    # Yarn sources
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    # Google chrome sources
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" | tee /etc/apt/sources.list.d/google.list \
    # Node sources
    && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs yarn google-chrome-stable chromedriver

RUN \
    # Installing geckodriver
    wget https://github.com/mozilla/geckodriver/releases/download/v0.21.0/geckodriver-v0.21.0-linux64.tar.gz \
    && tar xvfz geckodriver-v0.21.0-linux64.tar.gz \
    && mv geckodriver /usr/local/bin \
    && rm geckodriver-v0.21.0-linux64.tar.gz \
    # Firefox sources
    && echo "deb http://http.debian.net/debian unstable main" | tee /etc/apt/sources.list.d/debian-unstable.list \
    && apt-get -qq update \
    && apt-get install -y firefox

# Updating pip
RUN pip install pip --upgrade \
    && pip install setuptools --upgrade \
    && easy_install -U distribute \
    && pip install --upgrade django djangorestframework django-rest-auth[with_social] \
                             selenium coreapi mod_wsgi \
                             git+https://github.com/vincent-noel/GINsim-python.git \
                             git+https://github.com/vincent-noel/pyMaBoSS.git

ADD . .

# Removing node modules, downloading them from scratch, and transpiling the JSX
RUN rm -fr node_modules/* yarn.lock; yarn && \
                  npm run dev

# Removing old db and medias, creating a new one, with default user admin:admin
RUN rm -fr db.sqlite3 media; mkdir media; python manage.py makemigrations --noinput && \
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
                                --url-alias /media media/ \
                                --reload-on-changes

RUN chown -R www-data:www-data .

# Exposing port 8000 for server access
EXPOSE 8000

# Switching to apache user
USER www-data

# Running server
ENTRYPOINT /appCurie/server/apachectl -D FOREGROUND