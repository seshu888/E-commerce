import React, { Component } from 'react';

import Layout from '../layout/Layout';

class NotFound extends Component {
	render() {
		return (
			<Layout history={this.props.history} title="Not Found">
				<h1>NotFound</h1>;
			</Layout>
		);
	}
}
export default NotFound;
