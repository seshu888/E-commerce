import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { withStyles, Drawer } from '@material-ui/core';

import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Message from '../components/message/Message';

import * as jwtService from '../services/jwtService';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../store/actions';
import { blue } from '@material-ui/core/colors';
import AppContext from '../context/AppContext';

const topbarHeight = 68,
	sidebarWidth = 270,
	foldedSidebarWidth = 80;

// Component styles
const styles = (theme) => ({
	topbar: {
		height: topbarHeight,
		position: 'fixed',
		width: '100%',
		top: 0,
		left: 0,
		right: 'auto',
		transition: theme.transitions.create([ 'margin', 'width' ], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		backgroundColor: '#f5f5f5',
		boxShadow:
			'0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
	},
	topbarShift: {
		marginLeft: sidebarWidth + 1,
		width: `calc(${-(sidebarWidth + 1)}px + 100vw)`
	},
	drawerPaper: {
		zIndex: 1200,
		width: sidebarWidth + 1,
		backgroundColor: blue[600],
		boxShadow:
			'0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
		color: 'white',
		transition: theme.transitions.create([ 'width', 'min-width' ], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.shorter
		}),
		'& .sidebar-title-icon': {
			display: 'none'
		}
	},
	toggleSidebar: {
		zIndex: 1200,
		width: foldedSidebarWidth,
		height: '100vh',
		backgroundColor: 'rgb(48, 48, 48)',
		boxShadow:
			'0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
		color: 'white',
		transition: theme.transitions.create([ 'width', 'min-width' ], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.shorter
		}),
		'& .sidebar-title-section': {
			display: 'none'
		},
		'& .sidebar-title-icon': {
			display: 'block'
		},
		'& .link-text': {
			opacity: 0
		}
	},
	content: {
		marginLeft: foldedSidebarWidth,
		marginTop: topbarHeight,
		overflowY: 'auto',
		height: `calc(100vh - ${topbarHeight}px)`,
		backgroundColor: '#F7F9FC',
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	contentShift: {
		marginLeft: sidebarWidth
	}
});

class Layout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			opened: true,
			hovered: false
		};
	}
	componentDidMount() {
		let user = localStorage.getItem('user');
		user = user ? JSON.parse(user) : null;
		let loggedIn = false;
		if (user) {
			loggedIn = true;
			this.props.setUser(user)
			this.context.updateUser(user)
		}

		if (loggedIn === false) {
			this.props.history.replace('/login');
		}
	}

	handleSignOut = () => {
		jwtService.logout();

		window.location = "/login";
	};

	handleToggle = () => {
		this.setState({ opened: !this.state.opened });
	};

	render() {
		
		const { classes, children} = this.props;
		const { opened } = this.state;
		const userData = this.context.user

		return (
			<Fragment>
				<Topbar
					className={classNames(classes.topbar, {
						[classes.topbarShift]: opened
					})}
					handleSignOut={this.handleSignOut}
					userData={userData}
				/>

				<div
					onMouseEnter={() => {
						this.setState({ hovered: true });
					}}
					onMouseLeave={() => {
						this.setState({ hovered: false });
					}}
				>
					<Drawer
						anchor="left"
						classes={{ paper: opened ? classes.drawerPaper : classes.toggleSidebar }}
						onClose={this.handleClose}
						open={true}
						variant="persistent"
					>
						<Sidebar handleToggle={this.handleToggle} history={this.props.history} />
					</Drawer>
				</div>

				<main
					className={classNames(classes.content, {
						[classes.contentShift]: opened
					})}
				>
					{children}
				</main>

				<Message />
			</Fragment>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{

			setUser: Actions.setUser
		},
		dispatch
	);
}
function mapStateToProps(reducer) {
	const authReducer = reducer.authReducer;
	return {
		userData: authReducer.userDetails

	};
}
Layout.contextType = AppContext;
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Layout));
