import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// pages
import routesConfig from 'configs/routesConfig';

export default class Routes extends Component {
	render() {
		return (
			<Switch>
				<Redirect exact from="/" to="/SystemList" />
				{routesConfig.map(
					(route, index) =>
						route.childrenComponents ? (
							route.childrenComponents.map((child, ind) => (
								<Route key={ind} component={child.component} exact path={child.to} />
							))
						) : (
							<Route key={index} component={route.component} exact path={route.to} />
						)
				)}
				<Redirect to="/" />
			</Switch>
		);
	}
}
