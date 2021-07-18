import * as jwtService from 'services/jwtService';
import * as authActions from './auth.actions';

export default function checkTokenError(error) {
	if (error && error.response && error.response.status) {
		if (error.response.status === 401) {
			jwtService.logout();
			// return authActions.setUserData(null);
		} else {
			return { type: 'notTokenError' };
		}
	} else
		return {
			type: 'notTokenError'
		};
}
