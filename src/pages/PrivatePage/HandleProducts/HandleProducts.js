import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Form,
  Select,
  Checkbox,
  Input,
  Upload,
  Button,
  message,
  Layout,
  theme,
  Breadcrumb,
  Space,
  Radio,
  notification
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axiosClient from "../../../libraries/axiosClient";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

export default function HandleProducts() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const sRef = useRef();
  const mRef = useRef();
  let settings = {
    singleFile: {
      defaultFileList: [],
    },
    multiFile: {
      defaultFileList: [],
    },
  };
  const { Header, Content } = Layout;
  const formItemLayout = {
    labelCol: {
      xs: { span: 4 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 40 },
      sm: { span: 20 },
    },
  };
  const formItemLayoutOptions = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 4,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 20,
      },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 20,
        offset: 4,
      },
    },
  };
  const { id } = useParams();
  const [form] = Form.useForm();
  const [defaultValue, setDefaultValue] = useState({});
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [defaultListFileU, setDefaultListFileU] = useState({
    singleFile: {
      defaultFileList: [],
    },
    multiFile: {
      defaultFileList: [],
    },
  });
  const [description, setDescription] = useState();
  const [spec, setSpec] = useState();
  let optionsPosition = [
    "Nổi bật","Bán chạy"
  ]
  function handleSuperText(prop) {
    console.log("Nhận vào html", prop);
  }

  useMemo(() => {
    let CrArray = new Array(1);
    if (defaultValue.coverImgUrl) {
      setDefaultListFileU((prev) => {
        prev.singleFile.defaultFileList = [];
        prev.singleFile.defaultFileList.push({
          uid: "-1",
          name: "old",
          status: "done",
          url: `${process.env.REACT_APP_API_URL}/${defaultValue.coverImgUrl}`,
        });
        return prev;
      });
    }
    if (defaultValue.Images) {
      setDefaultListFileU((prev) => {
        prev.multiFile.defaultFileList = [];
        let oldImgs = [];
        oldImgs = defaultValue.Images.map((img, index) => ({
          uid: `${-(index + 1)}`,
          name: `old-${index + 1}`,
          status: "done",
          url: `${process.env.REACT_APP_API_URL}/${img}`,
        }));
        console.log("oldImgs", oldImgs);
        prev.multiFile.defaultFileList.push(...oldImgs);
        return prev;
      });
    }
    form.setFieldsValue({ ...defaultValue });
  }, [defaultValue]);

  useEffect(() => {
    async function getCategoriesData() {
      const categoriesData = await axiosClient.get("/admin/data/categories");
      const suppliersData = await axiosClient.get("/admin/data/suppliers");
      if (categoriesData.status && suppliersData.status) {
        setSuppliers(suppliersData.data);
        setCategories(categoriesData.data);
      }
    }
    getCategoriesData();
  }, []);

  useEffect(() => {
    async function GetDfValue(id) {
      const product = await axiosClient.get(`/admin/data/products?id=${id}`);
      if (product.status) {
        if (product.data[0].categoryId) {
          const thisCategory = await axiosClient.get(
            `/admin/data/categories?id=${product.data[0].categoryId}`
          );
          if (thisCategory.status) {
            setSuppliers(
              thisCategory.data[0].supplierIds.map((sp) => sp.supplierId)
            );
          }
        }
        setDefaultValue(product.data[0]);
      }
    }
    if (id != "add") GetDfValue(id);
  }, [id]);

  useMemo(() => {
    if (categoryId) {
      const dataCategory = categories.find((ct) => ct._id == categoryId);
      if (dataCategory) {
        setSuppliers(dataCategory.supplierIds.map((dt) => dt.supplierId));
      }
    }
  }, [categoryId]);

  const handleOptions = (options) => {
    let data = {}
    let files = {}
    options.forEach(option => {

    })
  }

  async function handleAdd(format,file,sliders) {
    try {
      console.log('format ',format);
      const rsAdd =  await axiosClient.post('/admin/data/products/ADD/add',format)
      if(rsAdd.status) {
        await axiosClient.post(`/admin/upload-single/products/${rsAdd.data._id}`,file)
        await axiosClient.post(`/admin/upload-multi/products/${rsAdd.data._id}`,sliders)
      }
      return ({
        message : "Thêm mới thành công"
      })
    } catch (error) {
      console.log('lỗi thêm mới sản phẩm ',error);
      return ({
        message: "Lỗi thêm mới sản phẩm"
      })
    }
  }

  async function handleUpdate(id,format,file,sliders) {
    try {
      const rsUpdate =  await axiosClient.patch('/admin/data/products/UPDATE/update/'+id,format)
      if(rsUpdate.status) {
        if(file) {
          await axiosClient.post(`/admin/upload-single/products/${id}`,file)
        }
        if(sliders) {
          await axiosClient.post(`/admin/upload-multi/products/${id}`,sliders)
        }
      }
      return ({
        message : "Cập nhật thành công"
      })
    } catch (error) {
      console.log('lỗi cập nhật sản phẩm ',error);
      return ({
        message: "Lỗi cập nhật sản phẩm"
      })
    }
  }

  const handleSubmitSuccess = async (value) => {
    console.log("content ", value);
    try {
      let dataFormat = {
        name: value.name,
        code: value.code,
        active: value.active,
        price: value.price,
        discount: value.discount,
        spec: value.spec,
        supplierId: value.supplierId,
        categoryId: value.categoryId,
        description: value.description,
        promotionPosition: value.promotionPosition,
        options: value.options
      }
      let avatar = null
      let sliders = null
      if(value.fileImage) {
        avatar = new FormData()
        avatar.append('file',value.fileImage.file)
      }
      if(value.fileImages) {
        sliders = new FormData()
        value.fileImages.fileList.forEach(vl => {
          sliders.append('files',vl.originFileObj)

        })
      }
      let info = {message: "Lỗi"}
      if(id === 'add') {
        info = await handleAdd(dataFormat,avatar,sliders)
      }
      else {
        info = await handleUpdate(id,dataFormat,avatar,sliders)
      }
      
      notification.info(info.message)
      form.resetFields()
      navigate(-1)
    } catch (error) {
      console.log("Lỗi");
      notification.error("Lỗi")
    }
  };
  return (
    <Layout
      style={{ margin: 0, minHeight: 280, background: "colorBgContainer" }}
    >
      <Header
        style={{
          background: colorBgContainer,
        }}
      >
        <Breadcrumb
          style={{
            margin: "16px 0",
          }}
        >
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/admin/products">Product</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{id == "add" ? "Thêm mới" : "Sửa"}</Breadcrumb.Item>
        </Breadcrumb>
      </Header>
      <Content style={{ padding: "20px 190px 20px  0" }}>
        <Form
          form={form}
          onFinish={handleSubmitSuccess}
          onFinishFailed={(va) => {
            console.log("value2", va);
          }}
          {...formItemLayout}
        >
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập trường này" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mã Sản phẩm" name={['code']} >
            <Input />
          </Form.Item>
          <Form.Item label="Trạng thái" name={['active']} >
            <Radio.Group size="large">
              <Radio.Button value={true} checked>Hoạt động</Radio.Button>
              <Radio.Button value={false}>Khóa</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Giá"
            name="price"
            rules={[
              {
                validator: async (p) => {
                  return p >= 0;
                },
                message: "Giá không âm",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Giảm giá (%)"
            name="discount"
            rules={[
              // {
              //   type: "number",
              // },
              {
                validator: async (p) => {
                  return p >= 0 && p <= 75;
                },
                message: "Khuyến mãi không âm và vượt quá 75% giá sản phẩm",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Danh mục" name="categoryId">
            <Select
              onChange={(value) => setCategoryId(value)}
              showSearch
              options={categories.map((category) => ({
                value: category._id,
                label: category.name,
              }))}
            />
          </Form.Item>
          <Form.Item label="Nguồn" name="supplierId">
            <Select
              showSearch
              options={suppliers.map((supplier) => ({
                value: supplier._id,
                label: supplier.name,
              }))}
            />
          </Form.Item>
          <Form.Item label="Vị trí hiển thị" name={['promotionPosition']}>
            <Checkbox.Group options={optionsPosition} />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <ReactQuill
              theme="snow"
              value={description}
              modules={modules}
              formats={formats}
              onChange={setDescription}
            />
          </Form.Item>
          <Form.Item label="Thông số" name="spec">
            <ReactQuill
              theme="snow"
              modules={modules}
              formats={formats}
              value={spec}
              onChange={setSpec}
            />
          </Form.Item>
          <Form.Item label="Avatar" name="fileImage" rules={[{ type: "file" }]}>
            <Upload
              ref={sRef}
              beforeUpload={(file) => {
                return false;
              }}
              {...defaultListFileU.singleFile}
              listType="picture-card"
              onChange={(file) => {
                console.log("change file", file);
              }}
            >
              <div>
                <PlusOutlined />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Chọn hình ảnh
                </div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item label="Slider" name="fileImages" rules={[{ type: "file" }]}>
            <Upload
              ref={sRef}
              beforeUpload={(file) => {
                return false;
              }}
              {...defaultListFileU.singleFile}
              listType="picture-card"
              onChange={(file) => {
                console.log("change file", file);
              }}
            >
              <div>
                <PlusOutlined />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Chọn hình ảnh
                </div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item label='Tùy chọn'>
            <Form.List
              name="options"
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'color']}
                        rules={[{ required: true, message: 'Nhập tên màu' }]}
                      >
                        <Input placeholder="Màu" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'codeColor']}
                        rules={[{ required: true, message: 'Chọn mã màu' }, { type: 'regexp' }]}
                      >
                        <input type='color' />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'plus']}
                        rules={[{ required: true, message: 'Tiền chênh lệch' }]}
                      >
                        <Input placeholder="Chênh lệch" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'stock']}
                        rules={[{ required: true, message: 'Số lượng nhập' }]}
                      >
                        <Input placeholder="Tồn kho" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{
                        width: '60%',
                      }}
                      icon={<PlusOutlined />}
                    >
                      Thêm tùy chọn
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
}
