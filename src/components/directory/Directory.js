import React, { Component }from 'react';

import MenuItem from '../menuItem/MenuItem';

import '../directory/directory.scss'

class Directory extends Component {
  constructor (props) {
		super(props);

		this.state = {
			sections: [],
		}
	}

	renderMenuItem(){
		return this.state.sections.map(({title, imageUrl, id, size}) => (
			<MenuItem
				key={id}
				className=""
				title={title}
				imageUrl={imageUrl}
				size={size}
			/>
		))
	}

	render () {
		return (
			<div className="directory-menu">
			  {this.renderMenuItem()}
      </div>
		);
	}
}

export default Directory;
