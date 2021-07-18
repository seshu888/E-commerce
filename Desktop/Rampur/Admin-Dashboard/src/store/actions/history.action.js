import axios from 'axios'

export const GET_HISTORY = 'GET_HISTORY';
export function getHistory() {
	const request = axios.get('');
	return (dispatch) =>
		request.then((response) => {
		
			dispatch({
				type: GET_HISTORY,
				payload: response.data
			
			});
		});
}

// https://api.spacexdata.com/v3/history
