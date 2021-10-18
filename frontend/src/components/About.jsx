import React from "react";
import FullPage from "./FullPage";

class About extends React.Component {

	render(){
		return 	<FullPage path={this.props.match.path}>
			<h2>About</h2><br/><br/><br/>
			WebMaBoSS was created and is maintained by the team <b><a href="https://sysbio.curie.fr">Computational System Biology of Cancer</a></b> at <b><a href="https://institut-curie.org/">Institut Curie</a></b>.<br/>
			It is open-source and available on <b><a href="https://github.com/sysbio-curie/WebMaBoSS">GitHub</a></b>, where you can also find instructions to run it locally and tutorials.
			<br/><br/>
			<h3>Publications</h3><br/>
			
			Noel V, Ruscone M, Stoll G, Viara E, Zinoviev A, Barillot E, Calzone L. WebMaBoSS: A web interface for simulating Boolean models stochastically. <i>In Preparation</i>.
			<br/>
			Stoll G, Viara E, Barillot E, Calzone L. Continuous time Boolean modeling for biological signaling: application of Gillespie algorithm. BMC Syst Biol. 2012 Aug 29;6:116. doi: <a href="https://doi.org/10.1186/1752-0509-6-116">10.1186/1752-0509-6-116</a>.
		   	<br/>
			Stoll G, Caron B, Viara E, Dugourd A, Zinovyev A, Naldi A, Kroemer G, Barillot E, Calzone L.  MaBoSS 2.0: an environment for stochastic Boolean modeling. Bioinformatics btx123. 2017 Mar. DOI: <a href="https://doi.org/10.1093/bioinformatics/btx123">10.1093/bioinformatics/btx123</a>.
	   
	  		
		
		</FullPage>;
	}
}

export default About;