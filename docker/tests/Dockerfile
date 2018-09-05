FROM colomoto/colomoto-docker:2018-08-17
MAINTAINER Vincent Noel <contact@vincent-noel.fr>

USER root
ADD . /appCurie
WORKDIR /appCurie

RUN apt-get -qq update \
    && apt-get install -y python3 python3-pip curl software-properties-common nano git apt-transport-https

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
    && pip install --upgrade django djangorestframework django-rest-auth[with_social] selenium git+https://github.com/vincent-noel/GINsim-python.git

RUN yarn \
    && npm run dev

# Exposing port 8000 for server access
EXPOSE 8000
# Exposing port 8888 for notebook access
EXPOSE 8888



