import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import SingleProduct from "./pages/SingleProduct";
import Products from "./pages/Products";
import Auth from "./pages/AuthWrapper";
import ErrorPage from "./pages/ErrorPage";
import Checkout from "./pages/Checkout";
import PrivateRoute from "./pages/PrivateRoute";
import About from "./pages/About";
import Cart from "./pages/Cart";

import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AuthWrapper from "./pages/AuthWrapper";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <AuthWrapper>
      <BrowserRouter>
        <Navbar />
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/products" element={<Products />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/checkout" element={<Checkout />}></Route>
          <Route path="/products/:id" element={<SingleProduct />}></Route>
          <Route path="*" element={<ErrorPage />}></Route>
          
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthWrapper>
  );
}

export default App;
