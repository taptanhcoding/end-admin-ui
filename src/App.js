import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/PrivatePage/Home/Home";
import PrivateLayout from "./layouts/PrivateLayout";
import PublicLayout from "./layouts/PublicLayout";
import Login from "./pages/Login/Login";
import Categories from './pages/PrivatePage/Categories/Categories'
import Employees from './pages/PrivatePage/Employees/Employees'
import Products from './pages/PrivatePage/Products/Products'
import Sales from "./pages/PrivatePage/Sales/Sales";
import Suppliers from "./pages/PrivatePage/Suppliers/Suppliers";

function App() {
  return (
    <>
      <Router>
        <Routes>
        <Route path="/" element={<PrivateLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/admin/categories" element={<Categories/>} />
            <Route path="/admin/employees" element={<Employees/>} />
            <Route path="/admin/products" element={<Products/>} />
            <Route path="/admin/suppliers" element={<Suppliers/>} />
            <Route path="/admin/order" element={<Sales/>} />
          </Route>
          <Route path="/" element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>
          
        </Routes>
      </Router>
    </>
  );
}

export default App;
