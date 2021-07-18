const initialState = {
	userDetails: null,
	loginError: null
};

const authReducer = function(state = initialState, action) {
	if (action.type === 'LOGIN_USER') {
		state = { ...state, userDetails: action.payload, loginError: null };
	} else if (action.type === 'LOGIN_ERROR') {
		state = { ...state, loginError: action.payload };
	}
	else if (action.type === "SET_USER"){
		state={...state,userDetails:action.payload}
	}
	return state;
};

export default authReducer;
