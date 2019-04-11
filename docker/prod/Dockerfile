FROM colomoto/colomoto-docker:2018-12-22
MAINTAINER Vincent Noel <contact@vincent-noel.fr>

USER root
WORKDIR /appCurie

RUN apt-get -qq update \
    && apt-get install -y python3 python3-pip curl software-properties-common nano git apt-transport-https \
                          apache2 apache2-dev \
                          libmariadbclient-dev libgl1-mesa-glx

RUN \
    # Yarn sources
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    # Node sources
    && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs yarn

ADD . .

# Updating pip
RUN pip install pip --upgrade \
    && pip install setuptools --upgrade \
    && easy_install -U distribute \
    && pip install --upgrade -r /appCurie/requirements.txt

# Installing MaBoSS from github repo
RUN apt-get install -y flex bison \
    && git clone https://github.com/maboss-bkmc/MaBoSS-env-2.0 /MaBoSS-env-2.0 \
    && cd /MaBoSS-env-2.0/engine/src/ \
    && make install \
    && make MAXNODES=128 install \
    && make MAXNODES=256 install \
    && rm /opt/conda/bin/MaBoSS* \
    && ln -s /MaBoSS-env-2.0/engine/pub/MaBoSS /opt/conda/bin \
    && ln -s /MaBoSS-env-2.0/engine/pub/MaBoSS_128n /opt/conda/bin \
    && ln -s /MaBoSS-env-2.0/engine/pub/MaBoSS_256n /opt/conda/bin

# Removing node modules, downloading them from scratch, and transpiling the JSX
RUN rm -fr node_modules/* yarn.lock; yarn && \
                  npm run build
#                  rm -fr node_modules/ docker/

# Removing old db and medias, creating a new one, with default user admin:admin
RUN rm -fr data/ && \
    mkdir -p data/media && \
    mkdir -p data/db && \
    mkdir -p data/settings && \
    rm -fr api/migrations/*.py

# Removing old server, and creating it from scratch
RUN rm -fr server/; python manage.py runmodwsgi --setup-only \
                                --host 0.0.0.0 --port 8000 \
                                --user www-data --group www-data \
                                --server-root=server/ \
                                --settings=settings.prod_settings \
                                --url-alias /static static/ \
                                --url-alias /data/media media/ \
                                --reload-on-changes

RUN chown -R www-data:www-data settings data server static api/migrations frontend/migrations && chown www-data:www-data .

RUN rm -fr /appCurie/static/bootstrap /appCurie/static/jquery && \
    ln -s /appCurie/node_modules/bootstrap/ /appCurie/static && \
    ln -s /appCurie/node_modules/jquery/ /appCurie/static
# Exposing port 8000 for server access
EXPOSE 8000

# Switching to apache user
USER www-data

# Running server
ENTRYPOINT sleep 5 && /bin/bash /appCurie/create_default_db.sh --settings=settings.prod_settings && \
    /appCurie/server/apachectl -D FOREGROUND