import React from "react";

const Switch = props => <label className="switch" key={props.id}>
	<input
		type="checkbox"
		checked={props.checked}
		onChange={() => props.toggle()}
	/>
	<span className="slider round"/>
</label>;

export default Switch;