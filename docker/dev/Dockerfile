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

# Exposing port 8000 for server access
EXPOSE 8000

CMD bash -c "tail -f /dev/null"



