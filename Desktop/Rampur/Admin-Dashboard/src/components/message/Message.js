import React, { Component } from 'react';
import { Snackbar, IconButton, withStyles, SnackbarContent, Slide } from '@material-ui/core';
import { green, amber, blue } from '@material-ui/core/colors';
import classNames from 'classnames';
import { Close, CheckCircle, ErrorOutline } from '@material-ui/icons';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../store/actions';

function SlideTransition(props) {
	return <Slide {...props} direction="down" />;
}

const styles = (theme) => ({
	root: {},
	success: {
		backgroundColor: green[600],
		color: '#ffffff'
	},
	error: {
		backgroundColor: theme.palette.error.dark,
		color: theme.palette.getContrastText(theme.palette.error.dark)
	},
	info: {
		backgroundColor: blue[600],
		color: '#ffffff'
	},
	warning: {
		backgroundColor: amber[600],
		color: '#ffffff'
	}
});

class Message extends Component {
	render() {
		const { classes, options } = this.props;
		return (
			<Snackbar
				{...options}
				open={this.props.state}
				onClose={this.props.hideMessage}
				classes={{
					root: classes.root
				}}
				ContentProps={{
					variant: 'body2',
					headlineMapping: {
						body1: 'div',
						body2: 'div'
					}
				}}
				TransitionComponent={SlideTransition}
			>
				<SnackbarContent
					className={classNames(classes[options.variant])}
					style={{ paddingTop: 3, paddingBottom: 3 }}
					message={
						<div style={{ fontSize: 15, display: 'flex', alignItems: 'center' }}>
							{/* {variantIcon[options.variant] && (
								<Icon className="mr-8" color="inherit">
									{variantIcon[options.variant]}
								</Icon>
							)} */}
							{options.variant === 'success' && (
								// <IconButton key="close" aria-label="Close" color="inherit" className="mr-8">
								<CheckCircle style={{ width: '0.8em', height: '0.8em', marginRight: '6px' }} />
								// </IconButton>
							)}
							{options.variant === 'error' && (
								// <IconButton key="close" aria-label="Close" color="inherit" className="mr-8">
								<ErrorOutline style={{ width: '0.8em', height: '0.8em', marginRight: '6px' }} />
								// </IconButton>
							)}
							{options.message}
						</div>
					}
					action={[
						<IconButton key="close" aria-label="Close" color="inherit" onClick={this.props.hideMessage}>
							<Close />
						</IconButton>
					]}
				/>
			</Snackbar>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			hideMessage: Actions.hideMessage
		},
		dispatch
	);
}

function mapStateToProps(reducer) {
	const messageReducer = reducer.messageReducer;
	return {
		state: messageReducer.state,
		options: messageReducer.options
	};
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Message));
