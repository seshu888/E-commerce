
import './App.css';
import Login from './pages/Login';
import Layout from './components/Layout/Layout'
import {Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import AuthContext from './context/loginContext';
import { useContext } from 'react';

function App() {
  const authCtx=useContext(AuthContext)
  return (
    <div className="App">
      <Layout>
        <switch>
                    
       <Route  component={LandingPage} exact path="/"/>
 <Route  component={Login} exact path="/login"/>
          <Route  component={ProfilePage} exact path="/profile"/>

        </switch>
      </Layout>
    </div>
  );
}

export default App;
