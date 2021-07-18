import React, { useState } from 'react';
// Routes
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Routes from './routes/Routes';


// Themes
import { ThemeProvider } from '@material-ui/styles';
import Themes from './themes';
import AppContext from './context/AppContext';
import SnackMessage from './components/SnackMessage';



// Browser history
const browserHistory = createBrowserHistory();

function App() {
	let userObj = localStorage.getItem('user');
	const [ user, setUser ] = useState(userObj ? JSON.parse(userObj) : null);
	const [ snackMessages, setSnackMessages ] = useState([]);

	const addSnackMessage = (message) => {
	
		let newSnackMsgs = [ ...snackMessages, message ];
		setSnackMessages(newSnackMsgs);
		
	};
	const updateUser=(value)=>{
		setUser(value)
	}

	return (
		<AppContext.Provider value={{ user,updateUser, addSnackMessage }}>
			<ThemeProvider theme={Themes.default}>
				<Router history={browserHistory}>
					<Routes />
				</Router>

				<SnackMessage snackMessages={snackMessages} />
			</ThemeProvider>
		</AppContext.Provider>
	);
}
export default App;
