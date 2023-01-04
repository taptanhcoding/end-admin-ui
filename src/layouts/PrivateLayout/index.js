import React from 'react';
import {Outlet } from 'react-router-dom'
import {DatabaseOutlined ,DropboxOutlined, LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import classnames from 'classnames/bind'
import styles from './PrivateLayout.module.scss'
import HeaderLayout from './components/HeaderLayout/HeaderLayout';

const { Header, Content, Sider } = Layout;
const items1 = [
    {
        key: 'Data',
        icon: <DatabaseOutlined />,
        label: "Quản lý Data",
        children: [
            {
            key: 'Category',
            label: "Quản lý danh mục"
        },
        {
            key: 'Suppliers',
            label: "Quản lý nhà cung cấp"
        },
        {
            key: 'Products',
            label: "Quản lý sản phẩm"
        },
    ]
    },
    {
        key: 'Orders',
        icon: <DropboxOutlined />,
        label: "Quản lý Bán hàng"
    },
]



const cx = classnames.bind(styles)
function PrivateLayout() {
    return ( <Layout>
        <HeaderLayout/>
        <Outlet/>
      </Layout>);
}

export default PrivateLayout;