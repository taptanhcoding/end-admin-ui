import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, message, Form } from "antd";
import { LockOutlined, PlusOutlined, DeleteOutlined, UnlockOutlined } from "@ant-design/icons";
import axiosClient from "../../../libraries/axiosClient";
import ContentHandle from "../../../components/ContentHandle/ContentHandle";
import {
  showHandleStatusConfirm,
  showPromiseConfirm,
} from "../../../libraries/Modal";
import { images } from '../../../assets/images'

function Categories() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState([]);
  //xử lý dữ liệu vào
  const [link, setLink] = useState("/");
  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([])
  const [filter, setFilter] = useState('all')
  const [suppliers, setSuppliers] = useState([])

  

  useEffect(() => {
    async function getDataSupplier() {
      const categories = await axiosClient.get("/admin/data/categories");
      const supplierList = await axiosClient.get("/admin/data/suppliers");
      const dataWithKey = categories.data.map((value) => ({
        ...value,
        key: value.slug,
      }));
      const dataSupplier = supplierList.data.map((val) => {
        if (val.active == true && val.deleted == false) {
          return ({
            ...val,
            key: val.slug,
          })
        }
      })
      setSuppliers(dataSupplier)
      setData(dataWithKey);
      setDataFilter(dataWithKey.filter(val => !val.deleted))
    }
    getDataSupplier();
  }, []);

  useEffect(() => {
    async function getDataSupplierFilter() {
      let dataFilter = data
      switch (filter) {
        case 'all':
          dataFilter = data
          break;
        case 'active':
          dataFilter = data.filter(val => {
            if (val.active && !val.deleted) {
              return true
            }
          })
          break;
        case 'locked':
          dataFilter = data.filter(val => {
            if (!val.active && !val.deleted) {
              return true
            }
          })
          break;
        case 'deleted':
          dataFilter = data.filter(val => {
            if (val.deleted) {
              return true
            }
          })
          break;
        default:
          break;
      }

      setDataFilter(dataFilter)
    }
    getDataSupplierFilter();
  }, [filter]);
  //xử lý checkbox
  const rowSelection = {
    selections,
    onChange: (newSelectedRowKeys, selections) => {
      setSelections(selections);
    },
  };

  //xử lý layout,modal,form
  const [form] = Form.useForm()

  // Đây là Dữ liệu truyền vào
  //menu
  const items = [
    {
      key: "status",
      label: "Trạng thái",
      children: [
        {
          key: "all",
          label: `Tất cả (${data.filter(val => !val.deleted).length})`,
          onClick: () => {
            setFilter("all");
            setLink("/")

          },
        },
        {
          key: "active",
          label: `Hoạt động (${data.filter(val => { if (val.active && !val.deleted) return val }).length})`,
          onClick: () => {
            setFilter("active");
            setLink("/")

          },
        },
        {
          key: "locked",
          label: `Khóa (${data.filter(val => { if (!val.active) return val }).length})`,
          onClick: () => {
            setFilter("locked");
            setLink("/")

          },
        },
        {
          key: "deleted",
          label: `Đã Xóa (${data.filter(val => { if (val.deleted == true) return val }).length})`,
          onClick: () => {
            setFilter("deleted");
            setLink("/getDeleted")
          },
        },
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
        showPromiseConfirm({
          value: {},
          form,
          type: "Category",
          suppliers:suppliers,
          cb: async (value) => {
            try {
              const fileImage = value.fileImage;
              let formData = new FormData();
              if (fileImage) {
                formData.append("file", fileImage.file);
              }
              delete value.fileImage;
              const addSupplierSt = await axiosClient.post(`/admin/data/categories/ADD/add`, {
                ...value,
              });
              message.info(addSupplierSt.message);

              if (addSupplierSt.status) {
                if (fileImage) {
                  const uploadStatus = await axiosClient.post(`/admin/upload-single/categories/${addSupplierSt.data._id}`, formData)
                  message.info(uploadStatus.message);
                }
              }
            } catch (error) {
              console.log(error);
              message.error(error?.response?.data?.message);
            }
            form.resetFields();
            // navigate(0)
          },
          cbUpFile: async (fileUpload) => {

          },
        });
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
              type: "Category",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                console.log(ids);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.delete(
                    "/admin/data/categories/UPDATE/deletes",
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
              type: "Category",
              value: selections,
              cb: async (value) => {
                console.log('data xóa ', value);

                const ids = value.map((v) => v._id);
                let formData = new FormData();
                formData.append("ids", ids);
                try {
                  const deletesCtSt = await axiosClient.patch(
                    "/admin/data/categories/UPDATE/changeStatusM",
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
              type: "Category",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                console.log(ids);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.patch(
                    "/admin/data/categories/UPDATE/changeStatusM",
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
              type: "Category",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.patch(
                    "/admin/data/categories/UPDATE/restores",
                    { ids }
                  );
                  message.info(deletesCtSt.message);
                  navigate(0)
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
          label: "Xóa hoàn toàn",
          icon: <DeleteOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Delete",
              type: "Category",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                console.log(ids);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.delete(
                    "/admin/data/categories/DELETE/destroys",
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
  const ColumnsCategories= [
    {
      title: "",
      dataIndex: "active",
      width: "30px",
      render: (text) => {
        return text ? <UnlockOutlined /> : <LockOutlined />
      }
    },
    {
      title: "Danh mục",
      dataIndex: "name",
    },
    {
      title: "Icon",
      width: '100px',
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
      title: "Người tạo",
      dataIndex: 'createBy',
      render: (text) => {
        return text.creater
      }
    },
    {
      title: "Nhà cung cấp",
      dataIndex: 'supplierIds',
      suppliers,
      render: (text) => {
        return <ul>{text.map(vl => <li key = {vl.supplierId.name}>{vl.supplierId.name}</li>)}</ul>
      }
    },
    {
      title: "Action",
      render: (_, value) => {
        return (
          <>
            <Button
              type="primary"
              ghost
              style={{ marginRight: "10px" }}
              onClick={() => handleUpdate(value)}
            >
              Sửa
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => {
                showHandleStatusConfirm({
                  action: "Delete",
                  type: "Category",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let deleteStatus = await axiosClient.delete(
                        `/admin/data/categories/UPDATE/delete/${value[0]._id}`
                      );
                      message.info(deleteStatus.message);
                      navigate(0)
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

  const ColumnsCategoriesDeleted = [
    {
      title: "",
      dataIndex: "active",
      width: "30px",
      render: (text) => {
        return text ? <UnlockOutlined /> : <LockOutlined />
      }
    },
    {
      title: "Danh mục",
      dataIndex: "name",
    },
    {
      title: "Icon",
      width: '100px',
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
      title: "Người tạo",
      dataIndex: 'createBy',
      render: (text) => {
        return text.creater
      }
    },
    {
      title: "Nhà cung cấp",
      dataIndex: 'supplierIds',
      suppliers,
      render: (text) => {
        return <ul>{text.map(vl => <li key = {vl.supplierId.name}>{vl.supplierId.name}</li>)}</ul>
      }
    },
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
                  type: "Category",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let restoreSt = await axiosClient.patch(
                        `/admin/data/categories/UPDATE/restore/${value[0]._id}`
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
                  type: "Category",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let destroySt = await axiosClient.delete(
                        `/admin/data/categories/DELETE/destroy/${value[0]._id}`
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

  async function handleUpdate(value) {
    return showPromiseConfirm({
      value: value,
      form,
      suppliers,
      type: "Category",
      cb: async (value2) => {
        try {
          const fileImage = value2.fileImage;
          console.log("fileImage", fileImage);
          let formData = new FormData()
          if (fileImage) {
            formData.append("file", fileImage.file);
          }
          delete value2.fileImage;
          const updateSupplierST = await axiosClient.patch(`/admin/data/categories/UPDATE/update/${value._id}`, {
            ...value2,
          });
          if (updateSupplierST.status) {
            if (fileImage) {
              const uploadStatus = await axiosClient.post(`/admin/upload-single/categories/${value._id}`, formData)
              message.info(uploadStatus.message);
            }
          }
          message.info(updateSupplierST.message);
          form.resetFields();
          navigate(0)
        } catch (error) {
          console.log(error);
          message.error(error.response.data.message);
        }
      },
      cbUpFile: async (fileUpload) => {
      },
    });
  }
  //endx
  return (
    <div style={{ paddingTop: "10px" }}>
      <ContentHandle
        itemsFilter={items}
        itemsAction={link === "/getDeleted" ? itemsActionDelete : itemsAction}
        dataTable={dataFilter}
        rowSelection={rowSelection}
        columns={
          link === "/getDeleted" ? ColumnsCategoriesDeleted : ColumnsCategories}
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
}

export default Categories;
