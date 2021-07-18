import { combineReducers } from 'redux';

import messageReducer from './message.reducer';
import authReducer from './auth.reducer';
import historyReducer from './history.reducer';


const reducer = combineReducers({
	authReducer,
	messageReducer,
	historyReducer,


});

export default reducer;
