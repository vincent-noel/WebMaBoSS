FROM colomoto/colomoto-docker:2019-07-17
MAINTAINER Vincent Noel <contact@vincent-noel.fr>

USER root
WORKDIR /appCurie

RUN apt-get -qq update \
    && apt-get install -y python3 python3-pip curl software-properties-common nano git apt-transport-https \
                          apache2 apache2-dev libmariadbclient-dev

RUN \
    # Yarn sources
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    # Google chrome sources
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" | tee /etc/apt/sources.list.d/google.list \
    # Node sources
    && curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs yarn google-chrome-stable unzip \
    && wget https://chromedriver.storage.googleapis.com/76.0.3809.68/chromedriver_linux64.zip \
    && unzip chromedriver_linux64.zip \
    && mv chromedriver /usr/local/bin \
    && chmod 775 /usr/local/bin/chromedriver

RUN \
    # Installing geckodriver
    wget https://github.com/mozilla/geckodriver/releases/download/v0.24.0/geckodriver-v0.24.0-linux64.tar.gz \
    && tar xvfz geckodriver-v0.24.0-linux64.tar.gz \
    && mv geckodriver /usr/local/bin \
    && rm geckodriver-v0.24.0-linux64.tar.gz \
    # Firefox sources
    && echo "deb http://http.debian.net/debian unstable main" | tee /etc/apt/sources.list.d/debian-unstable.list \
    && apt-get -qq update \
    && apt-get install -y firefox

ADD requirements.txt /appCurie/requirements.txt

# Updating pip
RUN pip install pip --upgrade \
    && pip install setuptools --upgrade \
    && easy_install -U distribute \
    && pip install --upgrade -r /appCurie/requirements.txt \
    && pip install --upgrade selenium

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

# Exposing port 8000 for server access
EXPOSE 8000
# Exposing port 8888 for notebook access
EXPOSE 8888

WORKDIR /



