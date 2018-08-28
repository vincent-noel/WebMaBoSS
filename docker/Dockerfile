FROM colomoto/colomoto-docker:2018-08-17
MAINTAINER Vincent Noel <contact@vincent-noel.fr>

USER root
WORKDIR /

RUN apt-get -qq update
RUN apt-get install -y python3 python3-pip curl software-properties-common nano

# Installing Node.js
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - \
    && apt-get install -y nodejs

# Updating pip
RUN pip install pip --upgrade \
    && pip install setuptools --upgrade \
    && easy_install -U distribute

# Installing django
RUN pip install django djangorestframework django-rest-auth git+https://github.com/vincent-noel/GINsim-python.git

# Installing test tools
RUN apt-get install -y xvfb libgtk2.0-0 libxtst6 libxss1 libgconf-2-4 libnss3 libasound2

# Exposing port 8000 for server access
EXPOSE 8000
# Exposing port 8888 for notebook access
EXPOSE 8888



