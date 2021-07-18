const initialState = {
	history: null
	// loadingHistory: true
};

const historyReducer = function(state = initialState, action) {
	if (action.type === 'GET_HISTORY') {
	
		state = { ...state, history: action.payload };
	}

	return state;
};

export default historyReducer;
