import React from "react";
import getCSRFToken from "../commons/getCSRFToken";

class AddModelForm extends React.Component {

  constructor(props) {
  	super(props);

  	this.state = {
	  name: "",
	  file: undefined,
  	  fileName: "Select file... ",

    };

  	this.handleNameChange.bind(this);
  	this.handleFileChange.bind(this);
  	this.handleSubmit.bind(this);
  }

  handleNameChange (e) {
	this.setState({ name: e.target.value });
  };

  handleFileChange (e) {
  	console.log(e.target.files);
	this.setState({ file: e.target.files[0], fileName: e.target.files[0].name });
  };

  handleSubmit (e) {
	e.preventDefault();

    const formData = new FormData();
    formData.append('file', this.state.file);
    formData.append('name', this.state.name);

    const conf = {
	  method: "post",
	  body: formData,
	  headers: new Headers({
		  'X-CSRFToken': getCSRFToken()
	  })
	};

	fetch("/api/logical_models/", conf)
	.then(response => {
		this.setState({
			name: "",
			file: undefined,
			fileName: "Select file..."

		});
		this.props.updateParent();
	});

  };
  render() {

	return (

		<form onSubmit={(e) => this.handleSubmit(e)}>
			<div className="card">
				<div className="card-header">
					Add new model
				</div>
				<div className="card-body">
					<div className="form-group">
						<label htmlFor="modelName">Name</label>
						<input
							id="modelName"
							className="form-control"
							type="text"
							name="name"
							onChange={(e) => this.handleNameChange(e)}
							value={this.state.name}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="modelFile">File</label>
						<div className="custom-file" id="customFile">
							<input
								id="modelFile"
								type="file"
								className="custom-file-input"
								name="file"
								onChange={(e) => this.handleFileChange(e)} aria-describedby="fileHelp" required />
							<label className="custom-file-label" htmlFor="modelFile">{this.state.fileName}</label>
						</div>
					</div>
					<div>
						<button type="submit" className="btn btn-primary">
							Load model
						</button>
					</div>
				</div>
			</div>
		</form>
	);
  }
}
export default AddModelForm;