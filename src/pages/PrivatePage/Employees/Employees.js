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

function Employees() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState([]);
  //xử lý dữ liệu vào
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState([]);
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
            setFilter(prev => prev == 'all' ? '' : 'all')
          }
        },
        {
          key: "active",
          label: "Hoạt động",
          onClick: () => {
            setFilter('active')
          }
        },
        {
          key: "lock",
          label: "Khóa",
          onClick: () => {
            setFilter('lock')
          }
        },
        {
          key: "delete",
          label: "Đã xóa",
          onClick: () => {
            setFilter('delete')
          }
        }
      ],
    }
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
          type: "Employee",
          cb: async (value) => {
            try {
              if (!!value.supplierIds) {
                value.supplierIds = value.supplierIds.map((suppId) => ({
                  supplierId: suppId,
                }));
              }
              const fileImage = value.img;
              let formData = new FormData();
              if (fileImage) {
                formData.append("file", fileImage.file);
              }
              delete value.img;
              const addEmployeesSt = await axiosClient.post(
                `/admin/create-admin`,
                {
                  ...value,
                }
              );
              console.log("admin mới: ",addEmployeesSt);
              message.info(addEmployeesSt.message);

              if (addEmployeesSt.status) {
                if (fileImage) {

                  const uploadStatus = await axiosClient.post(
                    `/admin/upload-single/employees/${addEmployeesSt.data._id}`,
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
    }
  ];//=> cần sửa

  const itemsActionDelete = [
  ];
  //column table
  const ColumnsEmployees = [
    {
      title: "Trạng thái",
      dataIndex: "locked",
      render: (data) => {
        return data ? <LockOutlined /> : <UnlockOutlined />
      },
      width: '50px',
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
                  type: "Employee",
                  cb: async (value2) => {
                    try {
                      const fileImage = value2.img;
                      console.log('tồn tại ảnh : ', !!fileImage);
                      let formData = new FormData();
                      if (fileImage) {
                        formData.append("file", fileImage.file);
                      }
                      delete value2.fileImage;
                      console.log("value update", value2);
                      const updateEmployeesST = await axiosClient.patch(
                        `/admin/admin-update/${value._id}`,
                        {
                          ...value2,
                        }
                      );
                      // message.info(updateEmployeesST.message);
                      console.log(updateEmployeesST);
                      if (updateEmployeesST.status) {
                        if (fileImage) {
                          const uploadStatus = await axiosClient.post(
                            `/admin/upload-single/employees/${value._id}`,
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
                  type: "Employee",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let deleteStatus = await axiosClient.delete(
                        `/admin/admin-delete/${value[0]._id}`
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

  const ColumnsEmployeesDeleted = [
    {
      title: "Trạng thái",
      dataIndex: "locked",
      render: (data) => {
        return data ? <LockOutlined /> : <UnlockOutlined />
      },
      width: '50px',
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
                  type: "Employee",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let restoreSt = await axiosClient.patch(
                        `/admin/admin-restore/${value[0]._id}`
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
                  type: "Employee",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let destroySt = await axiosClient.delete(
                        `/admin/admin-destroy/${value[0]._id}`
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
    async function getDataEmployees() {
      const employees = await axiosClient.get("/admin/admin-list");
      const dataWithKey = employees.data.map((value) => ({
        ...value,
        key: value.email,
      }));
      setData(dataWithKey);
    }
    getDataEmployees();
  }, []);

  useEffect(() => {
    function setDtFilter(filter) {
      switch (filter) {
        case 'all':
          setDataFilter(data)
          break;
        case 'active':
          setDataFilter(data.filter(vl => vl.active && !vl.deleted))
          break;
        case 'lock':
          setDataFilter(data.filter(vl => !vl.active))
          break;
        case 'delete':
          setDataFilter(data.filter(vl => vl.deleted))
          break;
        default:
          break;
      }
    }
    setDtFilter(filter)
    if (!filter) {
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
        itemsFilter={items}
        itemsAction={filter === "delete" ? itemsActionDelete : itemsAction}
        dataTable={dataFilter}
        rowSelection={rowSelection}
        columns={
          filter === "delete" ? ColumnsEmployeesDeleted : ColumnsEmployees
        }
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
}

export default Employees;
