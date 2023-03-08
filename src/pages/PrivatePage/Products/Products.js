import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, message, Form, Carousel } from "antd";
import { LockOutlined, PlusOutlined, DeleteOutlined, UnlockOutlined } from "@ant-design/icons";
import axiosClient from "../../../libraries/axiosClient";
import ContentHandle from "../../../components/ContentHandle/ContentHandle";
import {
  showHandleStatusConfirm,
  showPromiseConfirm,
} from "../../../libraries/Modal";
import { images } from "../../../assets/images";

function Products() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState([]);
  //xử lý dữ liệu vào
  const [link, setLink] = useState("/");
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categoryId, setCategoryId] = useState(false)
  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([])
  const [filter, setFilter] = useState('all')
  //xử lý upload file

  //xử lý layout,modal,form
  const [form] = Form.useForm();
  const contentStyle = {
    height: "80px",
    width: "80px",
    color: "#fff",
    lineHeight: "30px",
    textAlign: "center",
    background: "#364d79",
  };
  // Đây là Dữ liệu truyền vào
  //menu
  const items = [
    {
      key: "status",
      label: "Trạng thái",
      children: [
        {
          key: "all",
          label: "Tất cả",
          onClick: () => {
            setFilter('all')
            setLink("/");
          },
        },
        {
          key: "active",
          label: "Hoạt động",
          onClick: () => {
            setFilter('active')
            setLink("/");
          },
        },
        {
          key: "locked",
          label: "Khóa",
          onClick: () => {
            setFilter('locked')
            setLink("/");
          },
        },
        {
          key: "deleted",
          label: "Đã xóa",
          onClick: () => {
            setFilter('deleted')
            setLink("/getDeleted");
          },
        }
      ],
    },
  ];
  //action trong table

  const itemsAction = [
    {
      key: "add",
      label: "Thêm mới",
      icon: <PlusOutlined />,
      onClick: () => {
        navigate('/admin/handle-products/add')
      },
    },
    {
      key: "control",
      label: "Quản trị",
      icon: <LockOutlined />,
      children: [
        {
          key: "Delete",
          label: "Xóa",
          icon: <DeleteOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Delete",
              type: "Product",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                console.log(ids);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.delete(
                    "/admin/data/products/UPDATE/deletes",
                    { data: { ids } }
                  );
                  message.info(deletesCtSt.message);
                  navigate(0);
                } catch (error) {
                  console.log(error);
                  message.error(error.response.data.message);
                }
              },
            });
          },
        },
        {
          key: "Locked",
          label: "Khóa",
          icon: <LockOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Lock",
              type: "Product",
              value: selections,
              cb: async (value) => {
                console.log('data xóa ', value);

                const ids = value.map((v) => v._id);
                let formData = new FormData();
                formData.append("ids", ids);
                try {
                  const deletesCtSt = await axiosClient.patch(
                    "/admin/data/products/UPDATE/changeStatusM",
                    { ids, status: false }
                  );
                  message.info(deletesCtSt.message);
                  navigate(0);
                } catch (error) {
                  console.log(error);
                  message.error(error.response.data.message);
                }
              },
            });
          },
        },
        {
          key: "UnLocked",
          label: "Mở khóa",
          icon: <UnlockOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Unlock",
              type: "Product",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                console.log(ids);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.patch(
                    "/admin/data/products/UPDATE/changeStatusM",
                    { ids, status: true }
                  );
                  message.info(deletesCtSt.message);
                  navigate(0);
                } catch (error) {
                  console.log(error);
                  message.error(error.response.data.message);
                }
              },
            });
          },
        }
      ],
    },
  ];

  const itemsActionDelete = [
    {
      key: "add",
      label: "Thêm mới",
      icon: <PlusOutlined />,
      onClick: () => {
        navigate('/admin/handle-products/add')
      },
    },
    {
      key: "control",
      label: "Quản trị",
      icon: <LockOutlined />,
      children: [
        {
          key: "Restore",
          label: "Khôi phục",
          icon: <DeleteOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Restore",
              type: "Product",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.put(
                    "/admin/data/products/UPDATE/restores",
                    { ids }
                  );
                  message.info(deletesCtSt.message);
                  navigate(0);
                } catch (error) {
                  console.log(error);
                  message.error(error?.response?.data?.message);
                }
              },
            });
          },
        },
        {
          key: "destroys",
          label: "Xóa luôn !",
          icon: <DeleteOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Delete",
              type: "Product",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                console.log(ids);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.delete(
                    "/admin/data/products/DELETE/destroys",
                    { data: { ids } }
                  );
                  message.info(deletesCtSt.message);
                  navigate(0);
                } catch (error) {
                  console.log(error);
                  message.error(error.response.data.message);
                }
              },
            });
          },
        },
      ],
    },
  ];
  //column table
  console.log('process.env.REACT_APP_API_URL', process.env.REACT_APP_API_URL);
  const settingColumns = [
    {
      title: "",
      dataIndex: "active",
      width: "30px",
      render: (text) => {
        return text ? <UnlockOutlined /> : <LockOutlined />
      }
    },
    {
      title: "Tên",
      dataIndex: "name",
    },
    {
      title: "Mã sp",
      dataIndex: "code",
    },
    {
      title: "giá",
      dataIndex: "price",
    },
    {
      title: "Khuyến mãi",
      dataIndex: "discount",
    },
    {
      title: "Tồn",
      dataIndex: "stock",
    },
    {
      title: "Danh mục",
      dataIndex: "categoty",
      render: (_, value) => {
        return value?.category?.name;
      },
    },
    {
      title: "Nguồn",
      dataIndex: "supplier",
      render: (_, value) => {
        return value.supplier?.name;
      },
    },
    {
      title: "Hình ảnh",
      dataIndex: "coverImgUrl",
      render: (text) => {
        return (
          <Image
            width={50}
            height={50}
            src={`${process.env.REACT_APP_API_URL}/${text}`}
            fallback={images.error}
          />
        );
      },
    },
    {
      title: "Slide",
      dataIndex: "sliderImageUrl",
      render: (text) => {
        return (
          <div style={{ width: "80px" }}>
            <Carousel effect="fade" autoplay>
              {text.map((ig, index) => (
                <div key={index}>
                  <Image
                    width={80}
                    height={80}
                    src={`${process.env.REACT_APP_API_URL}/${ig}`}
                    fallback={images.error}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        );
      },
    },]

  const ColumnsProduct = [
    ...settingColumns,
    {
      title: "Action",
      render: (_, value) => {
        return (
          <>
            <Button
              type="primary"
              ghost
              style={{ marginRight: "10px" }}
              onClick={() => {
                navigate(`/admin/handle-products/${value._id}`)
              }}
            >
              Sửa
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => {
                showHandleStatusConfirm({
                  action: "Delete",
                  type: "Product",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let deleteStatus = await axiosClient.delete(
                        `/admin/data/products/UPDATE/delete/${value._id}`
                      );
                      message.info(deleteStatus.message);
                      navigate(0);
                    } catch (error) {
                      console.log(error);
                      message.error(error?.response?.data?.message);
                    }
                  },
                });
              }}
            >
              Xóa
            </Button>
          </>
        );
      },
    },
  ];

  const ColumnsProductDeleted = [
    ...settingColumns,

    {
      title: "Action",
      render: (_, value) => {
        return (
          <>
            <Button
              type="primary"
              ghost
              style={{ marginRight: "10px" }}
              onClick={() => {
                showHandleStatusConfirm({
                  action: "Restore",
                  type: "Product",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let restoreSt = await axiosClient.put(
                        `/admin/data/products/UPDATE/restore/${value._id}`
                      );
                      message.info(restoreSt.message);
                      navigate(0);
                    } catch (error) {
                      console.log(error);
                      message.error(error?.response?.data?.message);
                    }
                  },
                });
              }}
            >
              Khôi phục
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => {
                showHandleStatusConfirm({
                  action: "Destroy",
                  type: "Product",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let destroySt = await axiosClient.delete(
                        `/admin/data/products/DELETE/destroy/${value._id}`
                      );
                      message.info(destroySt.message);
                      navigate(0);
                    } catch (error) {
                      console.log(error);
                      message.error(error?.response?.data?.message);
                    }
                  },
                });
              }}
            >
              Hủy diệt
            </Button>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    async function getDataProducts() {
      const products = await axiosClient.get("/admin/data/products" + link);
      const dataWithKey = products.data.map((value) => ({
        ...value,
        key: value.slug,
      }));
      setData(dataWithKey);
    }
    getDataProducts();
  }, []);
  useEffect(() => {
    switch (filter) {
      case 'all':
        setDataFilter(data)
        break;
      case 'active':
        setDataFilter(data.filter(val => {
          if (val.active && !val.deleted) {
            return true
          }
        }))
        break;
      case 'locked':
        setDataFilter(data.filter(val => {
          if (!val.active && !val.deleted) {
            return true
          }
        }))
        break;
      case 'deleted':
        setDataFilter(data.filter(val => {
          if (val.deleted) {
            return true
          }
        }))
        break;
      default:
        break;
    }
  }, [filter,data])

  useMemo(() => {
    async function getCateSupp() {
      const cateData = await axiosClient.get("/admin/data/categories");
      setCategories(cateData.data);
    }
    getCateSupp();
  }, []);

  //xử lý checkbox
  const rowSelection = {
    selections,
    onChange: (newSelectedRowKeys, selections) => {
      setSelections(selections);
    },
  };
  //endx
  return (
    <div style={{ paddingTop: "10px" }}>
      <ContentHandle
        itemsFilter={items}
        itemsAction={link === "/getDeleted" ? itemsActionDelete : itemsAction}
        dataTable={dataFilter}
        rowSelection={rowSelection}
        columns={
          link === "/getDeleted" ? ColumnsProductDeleted : ColumnsProduct
        }
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
}

export default Products;
