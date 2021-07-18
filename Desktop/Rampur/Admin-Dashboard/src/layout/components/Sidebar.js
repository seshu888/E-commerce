import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withStyles, IconButton, List, ListItem, ListItemText, ListItemIcon, Icon, Collapse } from '@material-ui/core';
import { Menu, Dashboard } from '@material-ui/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { blue } from "@material-ui/core/colors";

import routesConfig from 'configs/routesConfig';

const styles = (theme) => ({
	sidebar: {
		height: '100vh'
	},
	sidebarTopSection: {
		backgroundColor: blue[800],
		height: '64px'
	},
	sidebarContent: {
		height: 'calc(100% - 64px)',
		overflowY: 'auto',
		backgroundColor:blue[600]
	},
	iconCircle: {
		border: '2px solid grey',
		width: 50,
		height: 50,
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	listParentItem: {
		cursor: 'auto',
		padding: '6px 16px !important',
		display: 'flex',
		alignItems: 'flex-start',
		flexDirection: 'column'
	},
	parentHead: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'center',
		cursor: 'pointer',
		paddingBottom: '25px'
	},
	listItem: {
		cursor: 'pointer',
		padding: '6px 16px !important',
		display: 'flex',
		alignItems: 'flex-start',
		flexDirection: 'column',
		'&:hover': {
			backgroundColor: '#1360a4'
		}
	},
	activeListItem: {
		backgroundColor: `#1360a4 !important`
	},
	listItemIcon: {
		color: `${theme.palette.primary.contrastText} !important`,
		margin: '0px 15px 0px 6px',
		minWidth: 0
	},
	listItemText: {
		fontWeight: 400,
		fontSize: '14px',
		color: theme.palette.primary.contrastText
	},
	childDiv: {
		width: '100%'
	}
});

class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openRoutes: this.initOpenRoutes()
		};
	}
	// componentDidMount() {
	// this.initOpenRoutes();
	// }
	initOpenRoutes = () => {
		const pathName = this.props.history.location.pathname;
		let openRoutes = {};
		routesConfig.forEach((route, index) => {
			if (route.showOnSidebar) {
				let isActive = pathName.indexOf(route.to) === 0;
				if (!isActive && route.childrenComponents) {
					route.childrenComponents.forEach((child) => {
						if (!isActive) isActive = pathName.indexOf(child.to) === 0;
					});
				}
				openRoutes[index] = isActive;
			}
		});
		return openRoutes;
	};
	handleRouteExpand = (index) => {
		let openRoutes = this.state.openRoutes;
		if (openRoutes[index]) {
			openRoutes[index] = false;
		} else {
			openRoutes[index] = true;
		}
		this.setState({ openRoutes });
	};

	render() {
		const { classes, handleToggle } = this.props;
		const { openRoutes } = this.state;
		return (
			<div className={classes.sidebar}>
				<div className={classNames(classes.sidebarTopSection)}>
					<div className="w-full">
						<div className="flex flex-row items-center px-12 py-24 justify-between sidebar-title-section">
							<p className="projectHeader">KATA</p>
						</div>
						<div className="sidebar-title-icon w-full p-12 flex items-center justify-center">
							<div className={classes.iconCircle}>
								<p className="text-14 font-semibold">K</p>
							</div>
						</div>
					</div>
				</div>

				<div className={classes.sidebarContent}>
					<nav className="py-24">
						<List component="div" disablePadding>
							{routesConfig.map((route, index) => (
								<React.Fragment key={index}>
									{route.showOnSidebar ? (
										<React.Fragment>
											{route.childrenComponents ? (
												<div className={classes.listParentItem} key={index}>
													<div
														style={{
															paddingBottom:
																openRoutes && openRoutes[index] ? '12px' : '8px'
														}}
														className={classes.parentHead}
														onClick={() => this.handleRouteExpand(index)}
													>
														<div className="d-flex flex-row align-items-center">
															{route.icon && (
																<ListItemIcon className={classes.listItemIcon}>
																	<Icon className="flex-no-shrink text-white text-24">
																		{route.icon}
																	</Icon>
																</ListItemIcon>
															)}
															<ListItemText
																classes={{ primary: classes.listItemText }}
																className="text-30"
																primary={route.name}
															/>
														</div>
														{openRoutes && openRoutes[index] ? (
															<ExpandLessIcon />
														) : (
															<ExpandMoreIcon />
														)}
													</div>
													<div style={{ width: '100%' }}>
														<Collapse
															in={openRoutes && openRoutes[index]}
															timeout="auto"
															unmountOnExit
														>
															{route.childrenComponents.map((child, ind) => (
																<ListItem
																	activeClassName={classes.activeListItem}
																	className={classes.listItem}
																	component={NavLink}
																	to={child.to}
																	key={ind}
																>
																	<ListItemText
																		classes={{ primary: classes.listItemText }}
																		className="link-text"
																		primary={child.name}
																	/>
																</ListItem>
															))}
														</Collapse>
													</div>
												</div>
											) : (
												<ListItem
													activeClassName={classes.activeListItem}
													className={classes.listItem}
													component={NavLink}
													to={route.to}
													key={index}
												>
													<div className="d-flex flex-row align-items-center">
														{route.icon && (
															<ListItemIcon className={classes.listItemIcon}>
																<Icon className="flex-no-shrink text-white text-20">
																	{route.icon}
																</Icon>
															</ListItemIcon>
														)}
														<ListItemText
															classes={{ primary: classes.listItemText }}
															className="link-text"
															primary={route.name}
														/>
													</div>
												</ListItem>
											)}
										</React.Fragment>
									) : null}
								</React.Fragment>
							))}
						</List>
					</nav>
				</div>
			</div>
		);
	}
}
export default withStyles(styles)(Sidebar);
