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
import routes from "./configs/routes";

function App() {
  return (
    <>
      <Router>
        <Routes>
        <Route path="/" element={<PrivateLayout />}>
            {routes.map(route => {
              if(route.layout == 'PrivateLayout') {
                let Element = route.component
                return <Route path={route.path} element={<Element/>} />
              }
            })}
          </Route>
          <Route path="/" element={<PublicLayout />}>
          {routes.map(route => {
              if(route.layout == 'PublicLayout') {
                let Element = route.component
                return <Route path={route.path} element={<Element/>} />
              }
            })}
          </Route>
          <Route path="*" element={<Error/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
