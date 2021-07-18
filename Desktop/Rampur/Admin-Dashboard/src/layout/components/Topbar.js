import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';

import {
	Toolbar,
	Avatar,
	withStyles,
	Button,
	Icon,
	Popover,
	MenuItem,
	ListItemIcon,
	ListItemText
} from '@material-ui/core';
import { KeyboardArrowDown, ExitToApp } from '@material-ui/icons';
import classNames from 'classnames';
import { blue } from '@material-ui/core/colors';
import AppContext from '../../context/AppContext';

import userProfile from 'assets/imgs/user_profile.jpg';

const styles = (theme) => ({
	root: {
		borderBottom: `1px solid ${theme.palette.border}`,
		backgroundColor: 'white !important',
		display: 'flex',
		alignItems: 'center',
		height: '64px',
		zIndex: theme.zIndex.appBar
	},
	toolbar: {
		minHeight: 'auto',
		width: '100%'
	},
	avatar: {
		width: 45,
		height: 45,
		background: theme.palette.background.default,
		'& > img': {
			borderRadius: '50%'
		}
	}
});

class Topbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userMenu: null
		};
	}
	userMenuClick = (event) => {
		this.setState({ userMenu: event.currentTarget });
	};
	userMenuClose = () => {
		this.setState({ userMenu: null });
	};

	render() {
		const { classes, className, handleSignOut ,userData} = this.props;
		const { userMenu } = this.state;

		const rootClassName = classNames(classes.root, className);

		return (
			<Fragment>
				<div className={rootClassName}>
					<Toolbar className={classes.toolbar}>
						<div className="flex flex-row ml-auto w-full justify-end">
							<Button onClick={this.userMenuClick}>
								<div className="flex flex-row items-center">
									<Avatar
										className={classNames(classes.avatar, 'avatar')}
										alt="user photo"
										src={userProfile}
									/>
									<div className="flex flex-col items-start ml-12">
										<span className="text-14 whitespace-no-wrap normal-case leading-none">
										{userData?userData.name:'NA'}
										</span>
										
									</div>
									<KeyboardArrowDown className="text-16 ml-12" variant="action" />
								</div>
							</Button>
						</div>

						<Popover
							open={Boolean(userMenu)}
							anchorEl={userMenu}
							onClose={this.userMenuClose}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'center'
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'center'
							}}
							classes={{
								paper: 'py-1 px-4'
							}}
						>
							<MenuItem
								onClick={() => {
									this.userMenuClose();
									handleSignOut();
								}}
							>
								<ListItemIcon>
									<ExitToApp />
								</ListItemIcon>
								<ListItemText className="pl-0" primary="Logout" />
							</MenuItem>
						</Popover>
					</Toolbar>
				</div>
			</Fragment>
		);
	}
}

Topbar.contextType = AppContext;

export default (withRouter, withStyles(styles))(Topbar);
// 			{this.context && this.context.user ? this.context.user.name : 'NA'}