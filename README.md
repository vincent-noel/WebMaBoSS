# WebMaboSS : a web interface for simulating Boolean models stochastically
<img align="right" height="100" src="https://maboss.curie.fr/images/maboss_logo.jpg">


WebMaBoSS is a web interface for the MaBoSS, the Markovian Boolean Stochastic Simulator. MaBoSS is a C++ software for simulating continuous/discrete time Markov processes, applied on a Boolean network.

WebMaBoSS allows you to store, modify, and simulate MaBoSS models. You can also import/export models in other compatible formats (SBML-qual, GINsim, BNet). Models can also be imported from public databases (BioModels, CellCollective).

WebMaBoSS is available as a docker container that can quickly be developped locally. A live version is deployed at [https://maboss.curie.fr/WebMaBoSS/](https://maboss.curie.fr/WebMaBoSS).

### Use live version

To use the version available at [https://maboss.curie.fr/WebMaBoSS/](https://maboss.curie.fr/WebMaBoSS), you will need to create a user account. Once created, you can immediately login and start discovering the default project.

For more information, consult the tutorials. 


### Run locally with Docker and Docker-compose
```
git clone https://github.com/vincent-noel/WebMaBoSS
cd WebMaBoSS
docker-compose up -d webmaboss
```
	
And then open your browser to this url : http://localhost:8000/


### Tutorials

The directory tutorial contains two tutorials (in pdf) based on an example. In order to follow a tutorial, the necessary files are provided.

### License

[GNU Lesser General Public License v3](https://github.com/vincent-noel/WebMaBoSS/blob/master/LICENSE.md)
