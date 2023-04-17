import React, { useEffect, useState } from "react";
import { Menu, Layout,message } from "antd";
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
  UsergroupAddOutlined,
  ProfileOutlined ,
  FormOutlined 
} from "@ant-design/icons";
import axiosClient from "../../../../libraries/axiosClient";

function HeaderLayout() {
  const [countAuth,setCountAuth] = useState(0)
  const { Header } = Layout;
  const [admin, setAdmin] = useState({});
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
        {
          key: "Slide",
          label: "Quản lý Slider,Banner",
          onClick: () => navigate("/admin/shows"),
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
      onClick: () => navigate("/admin/employees"),
    },
    {
      key: "Người dùng",
      icon: <FormOutlined />,
      label: "Quản lý Người dùng",
      onClick: () => navigate("/admin/customers"),
    },
    {
      key: "admin",
      icon: <UserOutlined />,
      label: "Admin:" + admin.email,
      children: [
        {
          key: "Profile",
          icon: <ProfileOutlined />,
          label: "Cấu hình",
          onClick: async () => {
            navigate(`/admin/profile/${admin._id}`)
          }
        },
        {
          key: "Logout",
          icon: <LogoutOutlined />,
          label: "Đăng xuất",
          onClick:async () => {
            try {
              await axiosClient.delete('/admin/logout')
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              navigate(0);
              
            } catch (error) {
              console.log('lỗi đăng xuất',error);
              message.error("Gặp vấn đề với việc đăng xuất")
            }
          },
        },
      ],
    },
  ];
  async function CheckLogin() {
    axiosClient
      .get("/admin/auth")
      .then((login) => {
        setAdmin(login.admin);
      })
      .catch((err) => {
        console.log("err auth", err);
        if (!localStorage.getItem("refreshToken")) {
          navigate("/login");
        } else {
          if(!err.response.data.status) {
            navigate("/login");
          }
          setCountAuth(prev => prev +1)
          if(countAuth <= 4) {
            CheckLogin();
          }else{
          navigate("/login");
          }
        }
      });
  }

  useEffect(() => {
    CheckLogin();
  }, []);
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
