import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, message, Form, List } from "antd";
import { LockOutlined, PlusOutlined, DeleteOutlined, UnlockOutlined } from "@ant-design/icons";
import axiosClient from "../../../libraries/axiosClient";
import ContentHandle from "../../../components/ContentHandle/ContentHandle";
import {
  showHandleStatusConfirm,
  showPromiseConfirm,
} from "../../../libraries/Modal";
import { images } from "../../../assets/images";
import TimeTrans from "../../../libraries/timeTrans";

function Customers() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState([]);
  //xử lý dữ liệu vào
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('all')
  const [dataFilter, setDataFilter] = useState([])
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
          key: "all",
          label: "Tất cả",
          onClick: () => {
            setFilter(prev => prev == 'all' ? "" : 'all');
          },
        },
        {
          key: "active",
          label: "Hoạt động",
          onClick: () => {
            setFilter("active");
          },
        },
        {
          key: "lock",
          label: "Khóa",
          onClick: () => {
            setFilter('lock');
          },
        },
        {
          key: "delete",
          label: "Đã xóa",
          onClick: () => {
            setFilter("delete");
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
          type: "Customer",
          cb: async (value) => {
            try {
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
          cbUpFile: async (fileUpload) => { },
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
              type: "Customer",
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
        {
          key: "actives",
          label: "Kích hoạt",
          icon: <UnlockOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Unlock",
              type: "Customer",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                console.log(ids);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.patch(
                    "/admin/data/customers/UPDATE/changeStatusM",
                    { ids,status: true }
                  );
                  message.info(deletesCtSt.message);
                  // navigate(0);
                } catch (error) {
                  console.log(error);
                  message.error(error?.response?.data?.message);
                }
              },
            });
          },
        },
        {
          key: "locks",
          label: "Khóa",
          icon: <LockOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Lock",
              type: "Customer",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                console.log(ids);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.patch(
                    "/admin/data/customers/UPDATE/changeStatusM",
                    { ids,status: false }
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
                  const deletesCtSt = await axiosClient.patch(
                    "/admin/data/customers/UPDATE/restores",
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
                    "/admin/data/customers/DELETE/destroys",
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
      ],
    },
  ];
  //column table

  const customerColumnShare = [
    {
      title: "Trạng thái",
      dataIndex: "active",
      render: (data) => {
        return !data ? <LockOutlined /> : <UnlockOutlined />
      },
      width: '100px',
      align: 'center',
      fixed: 'left'
    },
    {
      title: "Mã khách hàng",
      dataIndex: "code",
      fixed:'left',
      width: '150px'
    },
    {
      title: "Khách hàng",
      dataIndex: "fullname",
    },
    {
      title: "Email",
      dataIndex: 'email'
    },
    {
      title: "Điện thoại",
      dataIndex: 'phoneNumber'
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
      title: "Sinh nhật",
      dataIndex: "birthday",
      render: (data) => {
        return  TimeTrans(data);
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (data) => {
        return  TimeTrans(data);
      },
    },
  ]
  const ColumnsCustomers = [
    ...customerColumnShare,
    {
      title: "Action",
      fixed : 'right',
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
                  type: "Customer",
                  cb: async (value2) => {
                    try {
                      const fileImage = value2.fileImage;
                      let formData = new FormData();
                      if (fileImage) {
                        formData.append("file", fileImage.file);
                      }
                      delete value2.fileImage;
                      console.log("value update", value2);
                      const updateCustomersST = await axiosClient.patch(
                        `/admin/data/customers/UPDATE/update/${value._id}`,
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
                  cbUpFile: async (fileUpload) => { },
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
                  type: "Customer",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let deleteStatus = await axiosClient.delete(
                        `/admin/data/customers/UPDATE/delete/${value[0]._id}`
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
    ...customerColumnShare,
    {
      title: "Action",
      fixed:'right',
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
                  type: "Customer",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let restoreSt = await axiosClient.patch(
                        `/admin/data/customers/UPDATE/restore/${value[0]._id}`
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
                  type: "Customer",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let destroySt = await axiosClient.delete(
                        `/admin/data/customers/DELETE/destroy/${value[0]._id}`
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
      const customers = await axiosClient.get("/admin/data/customers");
      const dataWithKey = customers.data.map((value) => ({
        ...value,
        key: value.email,
      }));
      setData(dataWithKey);
    }
    getDataCustomers();
  }, []);
  useEffect(() => {
    switch (filter) {
      case 'all':
        setDataFilter(data)
        break;
      case 'active':
        setDataFilter(data.filter(vl => vl.active && !vl.deleted))
        break;
      case 'lock':
        setDataFilter(data.filter(vl => !vl.active && !vl.deleted))
        break
      case 'delete':
        setDataFilter(data.filter(vl => vl.deleted))
        break
      default:
        break;
    }
    if(filter === '') {
      setFilter('all')
    }

  }, [filter, data])

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
        tableScroll={true}
        itemsFilter={items}
        itemsAction={filter === "delete" ? itemsActionDelete : itemsAction}
        dataTable={dataFilter}
        rowSelection={rowSelection}
        columns={
          filter === "delete" ? ColumnsCustomersDeleted : ColumnsCustomers
        }
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
}

export default Customers;
