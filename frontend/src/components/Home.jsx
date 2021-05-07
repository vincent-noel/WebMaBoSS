import React from "react";
import {Table, Row, Col, Card, CardBody, CardTitle, CardText, CardHeader} from "reactstrap";
import MaBoSSIcon from "./commons/MaBoSSIcon";

class Home extends React.Component {

	render(){
		return <React.Fragment>
		<br/><br/>
		<div className={"container"}>
			<Row>
				<Col className={"col-4"}>
					<MaBoSSIcon width={"250px"}/>
				</Col>
				<Col className={"col-8"}>
					<h1>WebMaBoSS</h1>
           			<h3>A web tool for simulating MaBoSS models</h3>
				</Col>
			</Row>
			<br/><br/>
			<Row>
				<Col className={"col-sm-4"}>
					<Card>
						<CardHeader>Simulate models</CardHeader>
						<CardBody>
							<CardText>Easy simulations, and multiple outputs for results. Also allows sensitivity analysis by performing single and double mutations.</CardText>
						</CardBody>
					</Card>
					
				</Col>
				<Col className={"col-sm-4"}>
					<Card>
						<CardHeader>Compatible</CardHeader>
						<CardBody>
							<CardText>WebMaBoSS is able to import models in MaBoSS format (bnd, cfg files), in SBML-qual format, or in GINsim format. It also allows to export models in any of these three formats.</CardText>
						</CardBody>
					</Card>
					
				</Col>
				<Col className={"col-sm-4"}>
					<Card>
						<CardHeader>Public databases</CardHeader>
						<CardBody>
							<CardText>Allows to browse models from CellCollective and BioModels, and import them</CardText>
						</CardBody>
					</Card>
					
				</Col>
			</Row>
		</div>
{/*         
        <div class="row">
          <div class="col-sm-4">
            <div class="card" style="width: 18rem;">
              <div class="card-body">
                <h5 class="card-title">Simulate models</h5>
                <p class="card-text"></p>
              </div>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="card" style="width: 18rem;">
              <div class="card-body">
                <h5 class="card-title"></h5>
                <p class="card-text"></p>
              </div>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="card" style="width: 18rem;">
              <div class="card-body">
                <h5 class="card-title"></h5>
                <p class="card-text"> </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <span class="text-muted">WebMaBoSS was created and is maintained by the team <b><a href="https://sysbio.curie.fr">Computational System Biology of Cancer</a></b> at <b><a href="https://institut-curie.org/">Institut Curie</a></b></span>
      </div> */}
	</React.Fragment>;
	}
}

export default Home;