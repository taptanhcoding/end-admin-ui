import Login from "../pages/Login/Login";
import Categories from "../pages/PrivatePage/Categories/Categories";
import Customers from "../pages/PrivatePage/Customers/Customers";
import Employees from "../pages/PrivatePage/Employees/Employees";
import HandleProducts from "../pages/PrivatePage/HandleProducts/HandleProducts";
import Home from "../pages/PrivatePage/Home/Home";
import Products from "../pages/PrivatePage/Products/Products";
import Profile from "../pages/PrivatePage/Profile/Profile";
import Sales from "../pages/PrivatePage/Sales/Sales";
import SlideShow from "../pages/PrivatePage/SlideShow/SlideShow";
import Suppliers from "../pages/PrivatePage/Suppliers/Suppliers";





const routes = [
    {
        path: '/',
        component: Home,
        layout : "PrivateLayout"
    },
    {
        path: '/admin/categories',
        component: Categories,
        layout : "PrivateLayout"
    },
    {
        path: '/admin/employees',
        component: Employees,
        layout : "PrivateLayout"
    },
    {
        path: '/admin/customers',
        component: Customers,
        layout : "PrivateLayout"
    },
    {
        path: '/admin/products',
        component: Products,
        layout : "PrivateLayout"
    },
    {
        path: '/admin/handle-products/:id',
        component: HandleProducts,
        layout : "PrivateLayout"
    },
    {
        path: '/admin/suppliers',
        component: Suppliers,
        layout : "PrivateLayout"
    },
    {
        path: '/admin/order',
        component: Sales,
        layout : "PrivateLayout"
    },
    {
        path: '/admin/profile/:id',
        component: Profile,
        layout : "PrivateLayout"
    },
    {
        path: '/admin/shows',
        component: SlideShow,
        layout : "PrivateLayout"
    },
    {
        path: '/login',
        component: Login,
        layout : "PublicLayout"
    },
]



export default routes