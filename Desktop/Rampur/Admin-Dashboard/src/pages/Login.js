import firebase from 'firebase';
import React, { Component } from 'react';
import { blue } from '@material-ui/core/colors';
import {
	withStyles,
	Grid,
	Typography,
	TextField,
	Button,
	CircularProgress,
	Card,
	CardContent,
	InputAdornment,
	Icon
} from '@material-ui/core';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'store/actions';

import Animate from 'components/Animate';
import * as jwtService from 'services/jwtService';
import AppContext from '../context/AppContext';

const styles = (theme) => ({
	root: {
		background: '#1135a7',
		color: theme.palette.secondary.contrastText,
		height: '100vh'
	}
	// root: {
	// 	background:
	// 		'linear-gradient(to right, ' +
	// 		theme.palette.primary.main +
	// 		' 0%, ' +
	// 		theme.palette.primary.main +
	// 		' 100% )',
	// 	color: theme.palette.primary.contrastText,
	// 	height: '100vh'
	// }
});

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			showingEmail: false,
			loginError: this.props.loginError
		};
	}
	componentDidMount() {
		let user = localStorage.getItem('user');
		user = user ? JSON.parse(user) : null;
		let loggedIn = false;
		if (user) {
			loggedIn = true;
		}
		if (loggedIn === true) {
			this.props.history.replace('/');
		}
	}
	componentDidUpdate(prevProps) {
		if (this.props.userDetails !== null) {
			localStorage.setItem('user', JSON.stringify(this.props.userDetails));
			this.context.updateUser(this.props.userDetails)
			this.props.history.replace('/');
		}
		if (this.props.loginError && prevProps.loginError !== this.props.loginError) {
			this.setState({ loginError: this.props.loginError, showingEmail: false });
		}
		return null;
	}
	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};
	handleLogin = () => {
		let { username, password } = this.state;
		if (username !== '' && password !== '') {
			let obj = {
				username: username,
				password: password
			};
			this.props.loginUser(obj);
		}
	};
	handleForgotPassword = () => {
		
		firebase.auth().sendPasswordResetEmail(this.state.username);
		this.setState({ showingEmail: true,loginError: null });
	};
	render() {
		const { classes, loginLoader } = this.props;
		const { username, password, loginError, showingEmail } = this.state;

		return (
			<div className={classNames(classes.root, 'flex flex-1 flex-no-shrink flex-row p-0')}>
				<div className="flex flex-col flex-no-grow text-black p-128 items-start md:flex-no-shrink md:flex-1 md:text-left">
					<Animate animation="transition.slideUpIn" delay={300}>
						<img width="300" src={require("assets/imgs/login.png") } alt="logo"/>
					</Animate>

					
				</div>

				<Animate animation={{ translateX: [ 0, '100%' ] }}>
					<Card className="w-384 max-w-384  ml-auto m-0" square>
						<CardContent className="flex flex-col items-center justify-center p-48 pt-128 ">
							<div className="w-full">
								<div className="flex flex-col px-20">
									<TextField
										className=" w-full "
										label="Email"
										name="username"
										color="primary"
										onChange={(event) => this.handleChange(event)}
										type="text"
										value={username}
										variant="outlined"
										fullWidth
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<Icon className="text-20">email</Icon>
												</InputAdornment>
											)
										}}
									/>

									{loginError &&
									!showingEmail && (
										<p className="text-red mt-2 text-center text-12">
											{loginError &&
											loginError !==
												'There is no user record corresponding to this identifier. The user may have been deleted.' &&
											loginError !==
												'The password is invalid or the user does not have a password.' ? (
												'User Disabled'
											) : null}
										</p>
									)}
									{loginError &&
									!showingEmail && (
										<p className="text-center text-red text-12 mt-2">
											{loginError &&
											loginError ===
												'There is no user record corresponding to this identifier. The user may have been deleted.' ? (
												'Couldn’t find your Kata Account'
											) : null}
										</p>
									)}

									<TextField
										className=" w-full mt-16"
										label="Password"
										name="password"
										onChange={(event) => this.handleChange(event)}
										type="password"
										value={password}
										variant="outlined"
										fullWidth
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<Icon className="text-20">vpn_key</Icon>
												</InputAdornment>
											)
										}}
									/>

									{loginError &&
									!showingEmail && (
										<p className="text-red mb-20 mt-2 text-center text-12">
											{loginError &&
											loginError ===
												'The password is invalid or the user does not have a password.' ? (
												'Wrong password. Try again or click Forgot password to reset it.'
											) : null}
										</p>
									)}

									{showingEmail && (
										<p style={{ color: 'green' }} className="text-center text-12 mt-4">
											A password reset link has been sent to your registered email address
										</p>
									)}

									<Button
										className="w-full mx-auto mt-16 normal-case"
										style={{
											backgroundColor: '#1135a7',
											color: 'white',
											width: '120px',
											padding: '5px'
										}}
										disabled={username === '' || password === '' || loginLoader}
										size="large"
										variant="contained"
										onClick={this.handleLogin}
									>
										Login
									</Button>
									<p
										onClick={this.handleForgotPassword}
										style={{color:'#1135a7'}}
										className="text-12 mt-4 text-center"
									>
										Forgot Password?
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</Animate>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			loginUser: Actions.loginUser
		},
		dispatch
	);
}

function mapStateToProps(reducer) {
	const authReducer = reducer.authReducer;
	return {
		userDetails: authReducer.userDetails,
		loginError: authReducer.loginError
	};
}
Login.contextType = AppContext;
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login));
