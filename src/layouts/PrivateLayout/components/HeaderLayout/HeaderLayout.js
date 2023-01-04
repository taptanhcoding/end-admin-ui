import React, { useEffect, useState } from "react";
import { Menu, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  DatabaseOutlined,
  DropboxOutlined,
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
   UsergroupAddOutlined
} from "@ant-design/icons";
import axiosClient from '../../../../libraries/axiosClient'

function HeaderLayout() {
  const { Header } = Layout;
  const [admin,setAdmin] = useState({})
  const navigate = useNavigate();
  const items1 = [
    {
      key: "Home",
      icon: <HomeOutlined />,
      label: "Trang chủ",
      onClick: () => navigate("/"),
    },
    {
      key: "Data",
      icon: <DatabaseOutlined />,
      label: "Quản lý Data",
      children: [
        {
          key: "Category",
          label: "Quản lý danh mục",
          onClick: () => navigate("/admin/categories"),
        },
        {
          key: "Suppliers",
          label: "Quản lý nhà cung cấp",
          onClick: () => navigate("/admin/suppliers"),
        },
        {
          key: "Products",
          label: "Quản lý sản phẩm",
          onClick: () => navigate("/admin/products"),
        },
      ],
    },
    {
      key: "Orders",
      icon: <DropboxOutlined />,
      label: "Quản lý Bán hàng",
      onClick: () => navigate("/admin/order"),
    },
    {
      key: "Nhân viên",
      icon: <UsergroupAddOutlined />,
      label: "Quản lý Nhân viên",
      onClick: () => navigate("/admin/order"),
    },
    
    {
      key: "admin",
      icon: <UserOutlined />,
      label: "Admin:" + admin.email,
      children: [
        {
          key: "Logout",
          icon: <LogoutOutlined />,
          label: "Đăng xuất",
          onClick: () => {
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            navigate(0)
          },
        },
      ]
    },
    
  ];

  useEffect(() => {
    async function CheckLogin() {
        try {
            let login = await axiosClient.get('/v1/auth')
            setAdmin(login.user)
        } catch (error) {
            navigate('/login')
        }
    }
    CheckLogin()
  },[])
  return (
    <Header className="header">
      <div className="logo"></div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={items1}
      />
    </Header>
  );
}

export default HeaderLayout;
