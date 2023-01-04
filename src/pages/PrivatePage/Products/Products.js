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
import { images } from "../../../assets/images";

function Products() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState([]);
  //xử lý dữ liệu vào
  const [link, setLink] = useState("/");
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
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
          type: "Product",
          categories,
          suppliers,
          cb: async (value) => {
            console.log('value add',value);
            // try {
            //   const fileImage = value.fileImage;
            //   let formData = new FormData();
            //   if (fileImage) {
            //     formData.append("file", fileImage.file);
            //   }
            //   delete value.fileImage;
            //   const addProductSt = await axiosClient.post(`/v1/products/add`, {
            //     ...value,
            //   });
            //   message.info(addProductSt.message);

            //   if (addProductSt.status) {
            //     if (fileImage) {
            //       const uploadStatus = await axiosClient.post(
            //         `/v1/upload-single/products/${addProductSt.data._id}`,
            //         formData
            //       );
            //       message.info(uploadStatus.message);
            //     }
            //   }
            // } catch (error) {
            //   console.log(error);
            //   message.error(error?.response?.data?.message);
            // }
            // form.resetFields();
            // navigate(0);
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
              type: "Product",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                console.log(ids);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.delete(
                    "/v1/products/deletes",
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
              type: "Product",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.put(
                    "/v1/products/restores",
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
              type: "Product",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                console.log(ids);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.delete(
                    "/v1/products/destroys",
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
  const ColumnsProduct = [
    {
      title: "Tên",
      dataIndex: "name",
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
        render: (_,value) => {
          console.log("_",_);
          console.log("value",value);
          return value.category.name
        }
      },
      {
        title: "Nguồn",
        dataIndex: "supplier",
        render: (_,value) => {
          console.log('value',value);
          return value.supplier.name
        }
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
                  type: "Product",
                  categories,
                  suppliers,
                  cb: async (value2) => {
                    console.log('value in', value2);
                    // try {
                    //   const fileImage = value2.fileImage;
                    //   console.log("fileImage", fileImage);
                    //   let formData = new FormData();
                    //   if (fileImage) {
                    //     formData.append("file", fileImage.file);
                    //   }
                    //   delete value2.fileImage;
                    //   const updateProductST = await axiosClient.put(
                    //     `/v1/products/update/${value._id}`,
                    //     {
                    //       ...value2,
                    //     }
                    //   );
                    //   if (updateProductST.status) {
                    //     if (fileImage) {
                    //       const uploadStatus = await axiosClient.post(
                    //         `/v1/upload-single/products/${value._id}`,
                    //         formData
                    //       );
                    //       message.info(uploadStatus.message);
                    //     }
                    //   }
                    //   message.info(updateProductST.message);
                    // } catch (error) {
                    //   console.log(error);
                    //   message.error(error.response.data.message);
                    // }
                    // form.resetFields();
                    // navigate(0);
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
                  type: "Product",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let deleteStatus = await axiosClient.delete(
                        `/v1/products/delete/${value._id}`
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
    {
      title: "Tên",
      dataIndex: "name",
    },
    {
      title: "Giá",
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
        console.log("_", _);
        console.log("value", value);
        return value.category.name;
      },
    },
    {
      title: "Nguồn",
      dataIndex: "supplier",
      render: (_, value) => {
        console.log("value", value);
        return value.supplier.name;
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
                  type: "Product",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let restoreSt = await axiosClient.put(
                        `/v1/products/restore/${value._id}`
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
                        `/v1/products/destroy/${value._id}`
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
      const products = await axiosClient.get("/v1/products" + link);
      const dataWithKey = products.data.map((value) => ({
        ...value,
        key: value.slug,
      }));
      setData(dataWithKey);
      setCountD(products.deleted);
      setCountA(products.countA);
    }
    getDataProducts();
  }, [link]);

  useEffect(() => {
    async function getCateSupp() {
      const cateData = await axiosClient.get('/v1/category')
      const suppData = await axiosClient.get('/v1/suppliers')
      setCategories(cateData.data)
      setSuppliers(suppData.data)
    }
    getCateSupp()
  },[])

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
          link === "/getDeleted" ? ColumnsProductDeleted : ColumnsProduct
        }
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
}

export default Products;
