import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, message, Form, List } from "antd";
import { LockOutlined, PlusOutlined, DeleteOutlined ,UnlockOutlined } from "@ant-design/icons";
import axiosClient from "../../../libraries/axiosClient";
import ContentHandle from "../../../components/ContentHandle/ContentHandle";
import {
  showHandleStatusConfirm,
  showPromiseConfirm,
} from "../../../libraries/Modal";
import { images } from "../../../assets/images";

function Customers() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  //xử lý dữ liệu vào
  const [link, setLink] = useState("/");
  const [data, setData] = useState([]);
  const [countD, setCountD] = useState(0);
  const [countA, setCountA] = useState(0);
  //xử lý upload file

  //xử lý layout,modal,form
  const [form] = Form.useForm();

  // Đây là Dữ liệu truyền vào
  //menu
  const items = [
    {
      key: "status",
      label: "Trạng thái",
      children: [
        {
          key: "active",
          label: countA ? `Hoạt động {${countA}}` : "Hoạt động",
          onClick: () => {
            setLink("/");
          },
        },
        {
          key: "deleted",
          label: countD ? `Khóa {${countD}}` : "Khóa",
          onClick: () => {
            setLink("/getDeleted");
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
          suppliers,
          type: "Customers",
          cb: async (value) => {
            console.log("data:::", value);
            try {
              if (!!value.supplierIds) {
                value.supplierIds = value.supplierIds.map((suppId) => ({
                  supplierId: suppId,
                }));
              }
              const fileImage = value.fileImage;
              let formData = new FormData();
              if (fileImage) {
                formData.append("file", fileImage.file);
              }
              delete value.fileImage;
              const addCustomersSt = await axiosClient.post(
                `/admin/data/customers/ADD/add`,
                {
                  ...value,
                }
              );
              message.info(addCustomersSt.message);

              if (addCustomersSt.status) {
                if (fileImage) {
                  const uploadStatus = await axiosClient.post(
                    `/admin/upload-single/customers/${addCustomersSt.data._id}`,
                    formData
                  );
                  message.info(uploadStatus.message);
                }
              }
            } catch (error) {
              console.log(error);
              message.error(error?.response?.data?.message);
            }
            form.resetFields();
            navigate(0);
          },
          cbUpFile: async (fileUpload) => {},
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
          label: "Xóa nhiều",
          icon: <DeleteOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Delete",
              type: "Customers",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                console.log(ids);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.delete(
                    "/admin/data/customers/deletes",
                    { data: { ids } }
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
          label: "Kích hoạt",
          icon: <DeleteOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Restore",
              type: "Customers",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.put(
                    "/admin/data/customers/restores",
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
          label: "Hủy diệt nhiều",
          icon: <DeleteOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Delete",
              type: "Customers",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.delete(
                    "/admin/data/customers/destroys",
                    { data: { ids } }
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
      ],
    },
  ];
  //column table
  const ColumnsCustomers = [
    {
      title: "Trạng thái",
      dataIndex: "locked",
      render: (data) => {
        return data ? <LockOutlined /> : <UnlockOutlined />
      },
      width:'50px',
      align: 'center'
    },
    {
      title: "Tên nhân viên",
      dataIndex: "fullname",
    },
    {
      title: "avatar",
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
      title: "Chức danh",
      dataIndex: "roles",
      render: (data) => {
        return data.pos;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (data) => {
        return "text";
      },
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
                showPromiseConfirm({
                  value: value,
                  form,
                  type: "Customers",
                  suppliers,
                  cb: async (value2) => {
                    try {
                      if (value2.supplierIds) {
                        value2.supplierIds = value2.supplierIds.map(
                          (suppId) => ({ supplierId: suppId })
                        );
                      }
                      const fileImage = value2.fileImage;
                      let formData = new FormData();
                      if (fileImage) {
                        formData.append("file", fileImage.file);
                      }
                      delete value2.fileImage;
                      console.log("value update", value2);
                      const updateCustomersST = await axiosClient.put(
                        `/admin/data/customers/update/${value._id}`,
                        {
                          ...value2,
                        }
                      );
                      // message.info(updateCustomersST.message);
                      console.log(updateCustomersST);
                      if (updateCustomersST.status) {
                        if (fileImage) {
                          console.log("vào đây rồi");
                          const uploadStatus = await axiosClient.post(
                            `/admin/upload-single/customers/${value._id}`,
                            formData
                          );
                          message.info(uploadStatus.message);
                        }
                      }
                    } catch (error) {
                      console.log(error);
                      message.error(error?.response?.data?.message);
                    }
                    form.resetFields();
                    navigate(0);
                  },
                  cbUpFile: async (fileUpload) => {},
                });
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
                  type: "Customers",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let deleteStatus = await axiosClient.delete(
                        `/admin/data/customers/delete/${value._id}`
                      );
                      console.log("deleteStatus", deleteStatus);
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

  const ColumnsCustomersDeleted = [
    {
      title: "Trạng thái",
      dataIndex: "locked",
      render: (data) => {

      },
      width: 30
    },
    {
      title: "Tên nhân viên",
      dataIndex: "fullname",
    },
    {
      title: "avatar",
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
      title: "Chức danh",
      dataIndex: "roles",
      render: (data) => {
        return "text";
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "supplierIds",
      render: (data) => {
        return "text";
      },
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
                  type: "Customers",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let restoreSt = await axiosClient.put(
                        `/admin/data/customers/restore/${value._id}`
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
                  type: "Customers",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let destroySt = await axiosClient.delete(
                        `/admin/data/customers/destroy/${value._id}`
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
    async function getDataCustomers() {
      const customers = await axiosClient.get("/admin/employees" + link);
      const dataWithKey = customers.data.map((value) => ({
        ...value,
        key: value.email,
      }));
      setData(dataWithKey);
      setCountD(customers.deleted);
      setCountA(customers.countA);
    }
    getDataCustomers();
  }, [link]);
  // useEffect(() => {
  //   async function getDataSuppliers() {
  //     const suppliers = await axiosClient.get('/admin/suppliers')
  //     const dataWithKey = suppliers.data.map((value) => ({
  //       ...value,
  //       key: value.slug,
  //     }));
  //     setSuppliers(dataWithKey)
  //   }
  //   getDataSuppliers()
  // },[])

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
        dataTable={data}
        rowSelection={rowSelection}
        columns={
          link === "/getDeleted" ? ColumnsCustomersDeleted : ColumnsCustomers
        }
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
}

export default Customers;
