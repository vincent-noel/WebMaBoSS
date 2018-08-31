FROM colomoto/colomoto-docker:2018-08-17
MAINTAINER Vincent Noel <contact@vincent-noel.fr>

USER root
WORKDIR /

RUN \
    # Yarn sources
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    # Google chrome sources
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    # Node sources
    curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get install -y python3 python3-pip curl software-properties-common nano git nodejs yarn google-chrome-stable firefox-esr

# Updating pip
RUN pip install pip --upgrade \
    && pip install setuptools --upgrade \
    && easy_install -U distribute \
    && pip install django djangorestframework django-rest-auth[with_social] git+https://github.com/vincent-noel/GINsim-python.git

# Exposing port 8000 for server access
EXPOSE 8000
# Exposing port 8888 for notebook access
EXPOSE 8888



