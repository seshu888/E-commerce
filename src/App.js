



import {BrowserRouter,Routes,Route,Link} from 'react-router-dom'

import Home from './pages/Home';
import SingleProduct from './pages/SingleProduct';
import Products from './pages/Products';
import Auth from './pages/Auth';
import ErrorPage from './pages/ErrorPage';
import Checkout from './pages/Checkout';
import PrivateRoute from './pages/PrivateRoute';
import About from './pages/About';
import Cart from './pages/Cart';

import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>

      <Navbar/>
      <Sidebar/>
      <Routes>
          <Route path='/' element={<Home/>}>
          
          </Route>
          <Route path='/about' element={<About/>}>
          
          </Route>
          <Route path='/products' element={<Products/>}>
          
          </Route>
          <Route path='/cart' element={<Cart/>}>
          
          </Route>
          <Route path='/checkout' element={<Checkout/>}>
          
          </Route>
          <Route path='/products/:id' element={<SingleProduct/>}>
          
          </Route>
          <Route path='*' element={<ErrorPage/>}>
          
          </Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
