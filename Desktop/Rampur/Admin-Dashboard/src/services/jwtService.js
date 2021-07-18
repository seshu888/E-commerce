import jwtDecode from 'jwt-decode';
import axios from 'axios';

export function isAuthTokenValid(access_token) {
	if (!access_token) {
		return false;
	}
	const decoded = jwtDecode(access_token);
	const currentTime = Date.now() / 1000;
	if (decoded.exp < currentTime) {
		console.warn('access token expired');
		return false;
	} else {
		return true;
	}
}

export function setSession(access_token) {
	if (access_token) {
		localStorage.setItem('jwt_access_token', access_token);
	
	} else {
		localStorage.removeItem('jwt_access_token');
	
	}
}

export function logout() {
	
	localStorage.removeItem("user")


}
