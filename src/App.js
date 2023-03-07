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
import HandleProducts from "./pages/PrivatePage/HandleProducts/HandleProducts";
import Error from "./pages/Error/Error";
import Profile from "./pages/PrivatePage/Profile/Profile";
import Customers from "./pages/PrivatePage/Customers/Customers";

function App() {
  return (
    <>
      <Router>
        <Routes>
        <Route path="/" element={<PrivateLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/admin/categories" element={<Categories/>} />
            <Route path="/admin/employees" element={<Employees/>} />
            <Route path="/admin/customers" element={<Customers/>} />
            <Route path="/admin/products" element={<Products/>} />
            <Route path="/admin/handle-products/:id" element={<HandleProducts/>} />
            <Route path="/admin/suppliers" element={<Suppliers/>} />
            <Route path="/admin/order" element={<Sales/>} />
            <Route path="/admin/profile/:id" element={<Profile/>} />
          </Route>
          <Route path="/" element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="*" element={<Error/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
