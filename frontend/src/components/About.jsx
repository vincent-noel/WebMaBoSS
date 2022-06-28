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
			<ul>
				<li>Noel V, Ruscone M, Stoll G, Viara E, Zinovyev A, Barillot E, Calzone L. WebMaBoSS: A web interface for simulating Boolean models stochastically. <i>Frontiers in molecular biosciences 2021; 8: 754444</i>. doi: <a href="https://doi.org/10.3389/fmolb.2021.754444">10.3389/fmolb.2021.754444</a></li>
				<br/>
				<li>Stoll G, Viara E, Barillot E, Calzone L. Continuous time Boolean modeling for biological signaling: application of Gillespie algorithm. <i>BMC Syst Biol. 2012 Aug 29;6:116</i>. doi: <a href="https://doi.org/10.1186/1752-0509-6-116">10.1186/1752-0509-6-116</a>.</li>
				<br/>
				<li>Stoll G, Caron B, Viara E, Dugourd A, Zinovyev A, Naldi A, Kroemer G, Barillot E, Calzone L.  MaBoSS 2.0: an environment for stochastic Boolean modeling. <i>Bioinformatics btx123. 2017 Mar</i>. doi: <a href="https://doi.org/10.1093/bioinformatics/btx123">10.1093/bioinformatics/btx123</a>.</li>
			</ul>
	  		
		
		</FullPage>;
	}
}

export default About;