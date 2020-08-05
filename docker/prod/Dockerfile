FROM debian:10.5-slim
MAINTAINER Vincent Noel <contact@vincent-noel.fr>

USER root
WORKDIR /var/webmaboss


## -----------------------------------------------------------------------------------------------
## distribution packages
##
RUN apt-get update -qq && \
    apt-get install -yq --no-install-recommends ca-certificates wget python3 python3-pip python3-dev\
                          curl software-properties-common nano git apt-transport-https \
                          apache2 apache2-dev mariadb-client libmariadbclient-dev graphviz unzip \
    && python3 -m pip install --no-cache-dir --upgrade setuptools pip wheel

##-----------------------------------------------------------------------------------------------
## base conda environment
## 
RUN CONDA_VERSION="py37_4.8.2" && \
    wget --quiet https://repo.continuum.io/miniconda/Miniconda3-${CONDA_VERSION}-Linux-x86_64.sh -O ~/miniconda.sh && \
    /bin/bash ~/miniconda.sh -b -p /opt/conda && \
    rm ~/miniconda.sh 
          
ENV PATH="${PATH}:/opt/conda/bin"

RUN conda config --set auto_update_conda False \
    && conda install --no-update-deps -y \
        potassco::clingo=5.4.0=py37lua53hf484d3e_0 \
        colomoto::ginsim=3.0.0b=12

## -----------------------------------------------------------------------------------------------
## NodeJS & Yarn install
##
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && npm install -g yarn

## -----------------------------------------------------------------------------------------------
## Installing MaBoSS from github repo
##
RUN apt-get install -y --no-install-recommends flex bison g++ make \
    && git clone https://github.com/maboss-bkmc/MaBoSS-env-2.0 /opt/MaBoSS-env-2.0 \
    && cd /opt/MaBoSS-env-2.0/engine/src/ \
    && make install \
    && make MAXNODES=128 install \
    && make MAXNODES=256 install \
    && mv /opt/MaBoSS-env-2.0/engine/pub/MaBoSS /opt/conda/bin \
    && mv /opt/MaBoSS-env-2.0/engine/pub/MaBoSS_128n /opt/conda/bin \
    && mv /opt/MaBoSS-env-2.0/engine/pub/MaBoSS_256n /opt/conda/bin \
    && rm -fr /opt/MaBoSS-env-2.0
    
ADD requirements.txt /var/webmaboss/requirements.txt
RUN python3 -m pip install --no-cache-dir --upgrade -r /var/webmaboss/requirements.txt

ADD . /var/webmaboss/

# Removing node modules, downloading them from scratch, and transpiling the JSX
RUN rm -fr node_modules/* yarn.lock \
    && yarn \
    && npm run build

# Removing old db and medias, creating a new one, with default user admin:admin
RUN rm -fr data/ && \
    mkdir -p data/media && \
    mkdir -p data/db && \
    mkdir -p data/settings
#    rm -fr api/migrations/*.py

# Removing old server, and creating it from scratch
RUN rm -fr server/; python3 manage.py runmodwsgi --setup-only \
                                --host 0.0.0.0 --port 8000 \
                                --user www-data --group www-data \
                                --server-root=server/ \
                                --settings=settings.prod_settings \
                                --url-alias /static static/ \
                                --url-alias /data/media media/ \
                                --reload-on-changes

RUN chown -R www-data:www-data settings data server static api/migrations frontend/migrations && chown www-data:www-data .

RUN rm -fr /var/webmaboss/static/bootstrap /var/webmaboss/static/jquery && \
    ln -s /var/webmaboss/node_modules/bootstrap/ /var/webmaboss/static && \
    ln -s /var/webmaboss/node_modules/jquery/ /var/webmaboss/static

# -------------------------------------------------------------------------------------------------
# Cleanup    
RUN conda clean -y --all && rm -rf /opt/conda/pkgs \
    && apt clean -y \
    && rm -rf /var/lib/apt/lists/ * \
    && rm -rf /var/webmaboss/node_modules/* yarn.lock

# Exposing port 8000 for server access
EXPOSE 8000

# Switching to apache user
USER www-data

# Running server
CMD /var/webmaboss/wait_db.sh; \
    /bin/bash /var/webmaboss/create_default_db.sh --settings=settings.prod_settings; \
    /var/webmaboss/server/apachectl -D FOREGROUND