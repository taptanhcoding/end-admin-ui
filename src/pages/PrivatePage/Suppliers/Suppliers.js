import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, message, Form } from "antd";
import { LockOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosClient from "../../../libraries/axiosClient";
import ContentHandle from "../../../components/ContentHandle/ContentHandle";
import {
  showHandleStatusConfirm,
  showPromiseConfirm,
} from "../../../libraries/Modal";
import {images} from '../../../assets/images'

function Suppliers() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState([]);
  //xử lý dữ liệu vào
  const [link, setLink] = useState("/");
  const [data, setData] = useState([]);
  const [countD, setCountD] = useState(0);
  const [countA, setCountA] = useState(0);
  //xử lý upload file

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
          type: "Supplier",
          cb: async (value) => {
            try {
              const fileImage = value.fileImage;
              let formData = new FormData();
              if(fileImage) {
                formData.append("file", fileImage.file);
              }
              delete value.fileImage;
              const addSupplierSt = await axiosClient.post(`/v1/suppliers/add`, {
                ...value,
              });
              message.info(addSupplierSt.message);

              if (addSupplierSt.status) {
                if (fileImage) {
                  const uploadStatus =  await axiosClient.post(`/v1/upload-single/suppliers/${addSupplierSt.data._id}`,formData)
                  message.info(uploadStatus.message);
                }
              }
            } catch (error) {
              console.log(error);
              message.error(error?.response?.data?.message);
            }
            form.resetFields();
            navigate(0)
          },
          cbUpFile: async(fileUpload) => {
            
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
          label: "Xóa nhiều",
          icon: <DeleteOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Delete",
              type: "Supplier",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                console.log(ids);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.delete(
                    "/v1/suppliers/deletes",
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
          label: "Kích hoạt",
          icon: <DeleteOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Restore",
              type: "Supplier",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.put(
                    "/v1/suppliers/restores",
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
          label: "Hủy diệt nhiều",
          icon: <DeleteOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Delete",
              type: "Supplier",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                console.log(ids);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.delete(
                    "/v1/suppliers/destroys",
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
  const ColumnsSupplier = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "icon",
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
                  type: "Supplier",
                  cb: async (value2) => {
                    try {
                      const fileImage = value2.fileImage;
                      console.log("fileImage",fileImage);
                      let formData = new FormData()
                      if(fileImage) {
                        formData.append("file", fileImage.file);
                      }
                      delete value2.fileImage;
                      const updateSupplierST = await axiosClient.put(`/v1/suppliers/update/${value._id}`, {
                        ...value2,
                      });
                      if (updateSupplierST.status) {
                        if (fileImage) {
                          const uploadStatus =  await axiosClient.post(`/v1/upload-single/suppliers/${value._id}`,formData)
                          message.info(uploadStatus.message);
                        }
                      }
                      message.info(updateSupplierST.message);
                    } catch (error) {
                      console.log(error);
                      message.error(error.response.data.message);
                    }
                    form.resetFields();
                    navigate(0)
                  },
                  cbUpFile: async(fileUpload) => {
                  },
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
                  type: "Supplier",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let deleteStatus = await axiosClient.delete(
                        `/v1/suppliers/delete/${value._id}`
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

  const ColumnsSupplierDeleted = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "icon",
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
                  type: "Supplier",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let restoreSt = await axiosClient.put(
                        `/v1/suppliers/restore/${value._id}`
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
                  type: "Supplier",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let destroySt = await axiosClient.delete(
                        `/v1/suppliers/destroy/${value._id}`
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
    async function getDataSupplier() {
      const suppliers = await axiosClient.get("/v1/suppliers" + link);
      const dataWithKey = suppliers.data.map((value) => ({
        ...value,
        key: value.slug,
      }));
      setData(dataWithKey);
      setCountD(suppliers.deleted);
      setCountA(suppliers.countA);
    }
    getDataSupplier();
  }, [link]);

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
        itemsAction={ link === "/getDeleted" ? itemsActionDelete : itemsAction}
        dataTable={data}
        rowSelection={rowSelection}
        columns={
          link === "/getDeleted" ? ColumnsSupplierDeleted : ColumnsSupplier
        }
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
}

export default Suppliers;
