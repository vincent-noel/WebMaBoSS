# WebMaboSS : a web interface for simulating Boolean models stochastically
[![Docker image](https://img.shields.io/docker/v/sysbiocurie/webmaboss?logo=docker&sort=date)](https://hub.docker.com/repository/docker/sysbiocurie/webmaboss/general)
<img align="right" height="100" src="https://maboss.curie.fr/images/maboss_logo.jpg">


WebMaBoSS is a web interface for the MaBoSS, the Markovian Boolean Stochastic Simulator. MaBoSS is a C++ software for simulating continuous/discrete time Markov processes, applied on a Boolean network.

WebMaBoSS allows you to store, modify, and simulate MaBoSS models. You can also import/export models in other compatible formats (SBML-qual, GINsim, BNet). Models can also be imported from public databases (BioModels, CellCollective).

WebMaBoSS is available as a docker container that can quickly be deployed locally. You will need [Docker](https://docs.docker.com/get-docker/) and optionally [Docker-Compose](https://docs.docker.com/compose/install/).
A live version is deployed at [https://maboss.curie.fr/WebMaBoSS/](https://maboss.curie.fr/WebMaBoSS).

### Use live version

To use the version available at [https://maboss.curie.fr/WebMaBoSS/](https://maboss.curie.fr/WebMaBoSS), you will need to create a user account. Once created, you can immediately login and start discovering the default project.

For more information, consult the tutorials. 


### Run locally with Docker and Docker-compose
Launch WebMaBoSS's container using :

```
git clone https://github.com/sysbio-curie/WebMaBoSS
cd WebMaBoSS
docker pull sysbiocurie/webmaboss:1.0.0b17
docker-compose up -d webmaboss
```
	
And then open your browser to this url : http://localhost:8000/


This will use the docker image from sysbiocurie/webmaboss on [DockerHub](https://hub.docker.com/repository/docker/sysbiocurie/webmaboss/general). If you want to build your image locally, remove the docker pull command.
### Run locally with Docker
If you don't want to build the image (this can take 10-20 min), you can first download it from [DockerHub](https://hub.docker.com/repository/docker/sysbiocurie/webmaboss/general) : 

```
docker pull sysbiocurie/webmaboss:1.0.0b17
```

Otherwise :
```
docker build -f docker/Dockerfile -t sysbiocurie/webmaboss:1.0.0b17 
```

Then launch the container of the database. Note that you should modify the password. 
```
docker run -d --name webmaboss-db \
	--restart=always \
	-v webmaboss_db:/var/lib/mysql \
	-e MYSQL_RANDOM_ROOT_PASSWORD=yes \
	-e MYSQL_DATABASE=webmaboss \
	-e MYSQL_USER=webmaboss \
	-e MYSQL_PASSWORD=InsertAPassWordForTheDatabase \
	mariadb \
	--max_allowed_packet=268435456 
```
Then launch WebMaBoSS' container
```
docker run -d --name webmaboss \
	--restart=always \
	-v webmaboss_data:/var/webmaboss/data \
	-p 8000:8000 \
	--link webmaboss-db \
	-u www-data \
	-e DB_HOST=webmaboss-db \
	-e DB_PORT=3306 \
	-e DB_NAME=webmaboss \
	-e DB_USER=webmaboss \
	-e DB_PASSWORD=InsertAPassWordForTheDatabase \
	sysbiocurie/webmaboss:1.0.0b17 
```
And finally open your browser to this url : http://localhost:8000/

### Tutorials

The directory tutorial contains two tutorials based on the two models in the default project :

- [Tutorial on Cohen 2015 : Tumor Cell Invasion and Migration](https://github.com/sysbio-curie/WebMaBoSS/raw/master/tutorials/Tutorial_Cohen.pdf)
- [Tutorial on Corral 2020 : Interplay between SMAD2 and STAT5A regulating IL-17A/F expression in Th cells](https://github.com/sysbio-curie/WebMaBoSS/raw/master/tutorials/Tutorial_Corral.pdf)

### License

[GNU Lesser General Public License v3](https://github.com/vincent-noel/WebMaBoSS/blob/master/LICENSE.md)
