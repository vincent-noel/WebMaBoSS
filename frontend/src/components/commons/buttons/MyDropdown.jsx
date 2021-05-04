import React from "react";
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from "reactstrap";

class MyDropdown extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			open: false
		}
		this.toggle = this.toggle.bind(this);
		
	}
	
	toggle() {
		this.setState({open : !this.state.open});
	}
	
	render() {
		return <Dropdown isOpen={this.state.open} toggle={this.toggle} style={{textAlign: "center"}}>
			<DropdownToggle style={{width: this.props.width, overflowX: "hidden", textOverflow: "ellipsis"}} caret>{this.props.label}</DropdownToggle>
			<DropdownMenu style={{width: this.props.width}} className={"bg-dark"}>
			{
				Object.keys(this.props.dict).length > 0 ?
					Object.keys(this.props.dict).map((key, id) => {
						return <DropdownItem key={id} className={"bg-dark"}
							style={{ overflowX: "hidden", textOverflow: "ellipsis", color: "#fff"}}
							onClick={() => this.props.callback(key)}
						>{this.props.dict[key]}</DropdownItem>
				}) : null
			}
			</DropdownMenu>
	 	</Dropdown>;
	}
}

export default MyDropdown;