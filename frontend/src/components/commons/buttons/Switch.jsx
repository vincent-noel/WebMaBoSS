import React from "react";

const Switch = props => <label className="switch">
	<input
		type="checkbox"
		checked={props.checked}
		onChange={() => props.toggle()}
	/>
	<span className="slider round"/>
</label>;

export default Switch;