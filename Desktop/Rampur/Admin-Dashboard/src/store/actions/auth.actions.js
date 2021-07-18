import firebase from 'firebase';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const SET_USER="SET_USER"

export function loginUser(obj) {

	const request = firebase.auth().signInWithEmailAndPassword(obj.username, obj.password);
	return (dispatch) =>
		request
			.then((response) => {
				let user = response.user ? response.user : {};
				let obj = {};
				if (user) {
					let name = user.displayName;
					let split = name?name.split(' '):null;
					if(split && split.length>0 ){
						name = split[0]
					}
					
					obj = {
						name: name,
						email: user.email,
						phoneNumber: user.phoneNumber,
						accessToken: user.stsTokenManager ? user.stsTokenManager.accessToken : null,
						refreshToken: user.stsTokenManager ? user.stsTokenManager.refreshToken : null
					};
				
				}
				dispatch({
					type: LOGIN_USER,
					payload: obj
				});
			})
			.catch((error) => {
				dispatch({
					type: LOGIN_ERROR,
					payload: error.message
				});
			});
}


export function setUser(data){
	return ({
		type:SET_USER,
		payload:data
	})
}
