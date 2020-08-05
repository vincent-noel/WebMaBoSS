FROM debian:10.5-slim AS webmaboss-base

USER root
WORKDIR /var/webmaboss


## -----------------------------------------------------------------------------------------------
## distribution packages
##
RUN apt-get update -qq && \
    apt-get install -yq --no-install-recommends ca-certificates wget python3 python3-pip python3-dev\
                          curl software-properties-common nano git apt-transport-https \
                          apache2 apache2-dev mariadb-client libmariadbclient-dev graphviz unzip \
    && apt clean -y \
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
        colomoto::ginsim=3.0.0b=12 \
    && conda clean -y --all && rm -rf /opt/conda/pkgs

## -----------------------------------------------------------------------------------------------
## NodeJS & Yarn install
##
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt clean -y \
    && npm install -g yarn

## -----------------------------------------------------------------------------------------------
## Installing MaBoSS from github repo
##
RUN apt-get install -y --no-install-recommends flex bison g++ make \
    && apt clean -y \
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

# Exposing port 8000 for server access
EXPOSE 8000


FROM webmaboss-base AS webmaboss-base-with-test
# -------------------------------------------------------------------------------------------------
# Test environment : Firefox, Geckodriver, Chrome, Chromedriver
RUN \
    # Google chrome sources
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" | tee /etc/apt/sources.list.d/google.list \
    # Firefox sources
    # && echo "deb http://http.debian.net/debian unstable main" | tee /etc/apt/sources.list.d/debian-unstable.list \
    && apt-get -qq update \
    && apt-get install -y --no-install-recommends google-chrome-stable firefox-esr \
    && apt clean -y

    
    
RUN \
    # Installing chromedriver
    wget https://chromedriver.storage.googleapis.com/84.0.4147.30/chromedriver_linux64.zip \
    && unzip chromedriver_linux64.zip \
    && mv chromedriver /usr/local/bin \
    && chmod 775 /usr/local/bin/chromedriver \
    && rm chromedriver_linux64.zip

RUN \
    # Installing geckodriver
    wget https://github.com/mozilla/geckodriver/releases/download/v0.27.0/geckodriver-v0.27.0-linux64.tar.gz \
    && tar xvfz geckodriver-v0.27.0-linux64.tar.gz \
    && mv geckodriver /usr/local/bin \
    && rm geckodriver-v0.27.0-linux64.tar.gz

RUN \
    # Installing selenium
    python3 -m pip install --no-cache-dir --upgrade selenium

FROM webmaboss-base-with-test AS webmaboss-dev

CMD bash -c "tail -f /dev/null"

FROM webmaboss-base AS webmaboss

ADD . /var/webmaboss/

# Removing node modules, downloading them from scratch, and transpiling the JSX
RUN rm -fr node_modules/* yarn.lock \
    && yarn \
    && npm run build

# Removing old db and medias, creating a new one, with default user admin:admin
RUN rm -fr data/ \
    && mkdir -p data/media \
    && mkdir -p data/db \
    && mkdir -p data/settings \
    && mkdir -p static

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
RUN rm -rf /var/lib/apt/lists/ * \
    && rm -rf /var/webmaboss/node_modules/* yarn.lock


# Switching to apache user
USER www-data

# Running server
CMD /var/webmaboss/wait_db.sh; \
    /bin/bash /var/webmaboss/create_default_db.sh --settings=settings.prod_settings; \
    /var/webmaboss/server/apachectl -D FOREGROUND

FROM webmaboss-base-with-test AS webmaboss-test

ADD . /var/webmaboss/

# Removing old db and medias, creating a new one, with default user admin:admin
RUN rm -fr /var/webmaboss/data/ /var/webmaboss/api/migrations/*.py && \
    ls /var/webmaboss/api && \
    mkdir -p /var/webmaboss/data/media && \
    mkdir -p /var/webmaboss/data/db && \
    mkdir -p /var/webmaboss/data/settings && \
    mkdir -p /var/webmaboss/static && \
    chown -R www-data:www-data /var/webmaboss/settings /var/webmaboss/data /var/webmaboss/static /var/webmaboss/api/migrations && chown www-data:www-data /var/webmaboss && \
    mkdir /home/www-data && \
    usermod -d /home/www-data www-data && \
    chown -R www-data:www-data /home/www-data

RUN yarn && \
    npm run dev

USER www-data

CMD bash -c "tail -f /dev/null"
