import {
  Modal,
  Form,
  Input,
  Image,
  Upload,
  Select,
  Checkbox,
  Radio,
  Col,
  Row,
  DatePicker,
  TreeSelect,
  message
} from "antd";
import {
  ExclamationCircleFilled,
  AppstoreAddOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import axiosClient from "./axiosClient";
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const actions = {
  Delete: {
    title: "Xóa",
    typeButton: "danger",
  },
  Destroy: {
    title: "Hủy diệt",
    typeButton: "danger",
  },
  Lock: {
    title: "Khóa",
    typeButton: "danger",
  },
  Unlock: {
    title: "Kích hoạt",
    typeButton: "default",
  },
  Restore: {
    title: "Khôi phục",
    typeButton: "default",
  },
};

const forms = {
  Category: ({ form, settings, value, cb, cbUpFile, suppliers }) => {
    return (
      <Form
        form={form}
        onFinish={cb}
        onFinishFailed={(va) => {
          console.log("va2", va);
        }}
        {...formItemLayout}
      >
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập trường này" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input />
        </Form.Item>
        <Form.Item label="Nhà cung cấp" name="supplierIds">
          <Checkbox.Group
          >
            <Row>
              {suppliers.map((supplier) => (
                <Col key={supplier._id} span={12}>
                  <Checkbox value={{ supplierId: supplier._id }} checked>{supplier?.name}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item label="Trạng thái" name="active">
          <Radio.Group>
            <Radio value={true}> Hoạt động </Radio>
            <Radio value={false}> Khóa </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Icon mới" name="fileImage" rules={[{ type: "file" }]}>
          <Upload
            beforeUpload={(file) => {
              return false;
            }}
            {...settings.singleFile}
            listType="picture-card"
            onChange={(file) => {
              console.log("change file", file);
              cbUpFile(file);
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
      </Form>
    );
  },
  Supplier: ({ form, settings, value, cb, cbUpFile }) => {
    return (
      <Form
        form={form}
        onFinish={cb}
        onFinishFailed={(va) => {
          console.log("value2", va);
        }}
        {...formItemLayout}
      >
        <Form.Item
          label="Tên nhà cung cấp"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập trường này" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Email"
          name="email"
          rules={[
            {
              type: "email",
              message: "Vui lòng nhập định dạng: example@example.com",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Liên hệ"
          name="phoneNumber"
          rules={[
            {
              type: "regexp",
              message: "Vui lòng nhập định dạng: example@example.com",
            },
            {
              validator: async (p) => {
                const rex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
                return await rex.test(p);
              },
              message: "Định dạng :84/09821xxxxx",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>
        <Form.Item label="Trạng thái" name="active">
          <Radio.Group>
            <Radio value={true}> Hoạt động </Radio>
            <Radio value={false}> Khóa </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Hình đại diện"
          name="fileImage"
          rules={[{ type: "file" }]}
        >
          <Upload
            beforeUpload={(file) => {
              return false;
            }}
            {...settings.singleFile}
            listType="picture-card"
            onChange={(file) => {
              console.log("change file", file);
              cbUpFile(file);
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
      </Form>
    );
  },
  Employee: ({ form, settings, value, cb, cbUpFile, suppliers }) => {
    return (
      <Form
        form={form}
        onFinish={cb}
        onFinishFailed={(va) => {
          console.log("va2", va);
        }}
      >
        <Form.Item label="Họ" name='firstName'>
          <Input />
        </Form.Item>
        <Form.Item label="Tên" name='lastName'>
          <Input />
        </Form.Item>

        <Form.Item label="Avatar" name="img" rules={[{ type: "file" }]}>
          <Upload
            beforeUpload={(file) => {
              return false;
            }}
            listType="picture-card"
            {...settings.singleFile}
            onChange={(file) => {
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
        <Form.Item label="Email" name='email'>
          <Input />
        </Form.Item>
        <Form.Item label="Điện thoại" name='phoneNumber'>
          <Input />
        </Form.Item>
        <Form.Item label="Địa chỉ" name='address'>
          <Input />
        </Form.Item>
        <Form.Item label="Sinh nhật" name=''>
          <DatePicker />
        </Form.Item>
        <Form.Item label="Mã chức vụ" name={['roles', 'pos']}>
          <Select
            style={{ width: 120 }}
            options={[
              { value: 'owner', label: 'Owner' },
              { value: 'admin', label: 'Admin' },
              { value: 'support', label: 'Support' },
              { value: 'employee', label: 'Employee' },
            ]}
          />
        </Form.Item>
        <Form.Item label="Trạng thái" name={['active']}>
          <Radio.Group options={[{
            label: 'Hoạt động',
            value: true
          }, {
            label: "Khóa",
            value: false
          }]} optionType="button" />
        </Form.Item>
        <Form.Item label="Chức vụ" name={['roles', 'title']}>
          <Input
          />
        </Form.Item>
        <Form.Item label="Cho phép thay đổi phân quyền" name={['enableEditRoles']}>
          <Radio.Group options={[{
            label: 'Cho phép',
            value: true
          }, {
            label: "Không cho phép",
            value: false
          }]} optionType="button" />
        </Form.Item>
        <Form.Item label="Phân quyền" name={['roles', 'auth']}>
          <Form.Item label='Nhà cung cấp' name={['roles', 'auth', 'suppliers']} style={{ display: "flex", 'flexDirection': 'row' }}>
            <Checkbox.Group options={[{
              label: "Lấy danh sách",
              value: 'GET'
            }, {
              label: "Thêm",
              value: "ADD"
            },
            {
              label: "Sửa",
              value: "UPDATE"
            },
            {
              label: "Xóa",
              value: "DELETE"
            }
            ]} />
          </Form.Item>
          <Form.Item label='Danh mục' name={['roles', 'auth', 'categories']} style={{ display: "flex", 'flexDirection': 'row' }}>
            <Checkbox.Group options={[{
              label: "Lấy danh sách",
              value: 'GET'
            }, {
              label: "Thêm",
              value: "ADD"
            },
            {
              label: "Sửa",
              value: "UPDATE"
            },
            {
              label: "Xóa",
              value: "DELETE"
            }
            ]} />
          </Form.Item>
          <Form.Item label='Sản phẩm' name={['roles', 'auth', 'products']} style={{ display: "flex", 'flexDirection': 'row' }}>
            <Checkbox.Group options={[{
              label: "Lấy danh sách",
              value: 'GET'
            }, {
              label: "Thêm",
              value: "ADD"
            },
            {
              label: "Sửa",
              value: "UPDATE"
            },
            {
              label: "Xóa",
              value: "DELETE"
            }
            ]} />
          </Form.Item>
          <Form.Item label='Người dùng' name={['roles', 'auth', 'customers']} style={{ display: "flex", 'flexDirection': 'row' }}>
            <Checkbox.Group options={[{
              label: "Lấy danh sách",
              value: 'GET'
            }, {
              label: "Thêm",
              value: "ADD"
            },
            {
              label: "Sửa",
              value: "UPDATE"
            },
            {
              label: "Xóa",
              value: "DELETE"
            }
            ]} />
          </Form.Item>
          <Form.Item label='Bán hàng' name={['roles', 'auth', 'orders']} style={{ display: "flex", 'flexDirection': 'row' }}>
            <Checkbox.Group options={[{
              label: "Lấy danh sách",
              value: 'GET'
            }, {
              label: "Thêm",
              value: "ADD"
            },
            {
              label: "Sửa",
              value: "UPDATE"
            },
            {
              label: "Xóa",
              value: "DELETE"
            }
            ]} />
          </Form.Item>
          <Form.Item label='Nhân viên' name={['roles', 'auth', 'employees']} style={{ display: "flex", 'flexDirection': 'row' }}>
            <Checkbox.Group options={[{
              label: "Lấy danh sách",
              value: 'GET'
            }, {
              label: "Thêm",
              value: "ADD"
            },
            {
              label: "Sửa",
              value: "UPDATE"
            },
            {
              label: "Xóa",
              value: "DELETE"
            }
            ]} />
          </Form.Item>
          <Form.Item label='Slider' name={['roles', 'auth', 'sliders']} style={{ display: "flex", 'flexDirection': 'row' }}>
            <Checkbox.Group options={[{
              label: "Lấy danh sách",
              value: 'GET'
            }, {
              label: "Thêm",
              value: "ADD"
            },
            {
              label: "Sửa",
              value: "UPDATE"
            },
            {
              label: "Xóa",
              value: "DELETE"
            }
            ]} />
          </Form.Item>
          <Form.Item label='Bình luận' name={['roles', 'auth', 'comments']} style={{ display: "flex", 'flexDirection': 'row' }}>
            <Checkbox.Group options={[{
              label: "Lấy danh sách",
              value: 'GET'
            }, {
              label: "Thêm",
              value: "ADD"
            },
            {
              label: "Sửa",
              value: "UPDATE"
            },
            {
              label: "Xóa",
              value: "DELETE"
            }
            ]} />
          </Form.Item>

        </Form.Item>
        <Form.Item label="Mật khẩu mới" name={['password']}>
          <Input />
        </Form.Item>
      </Form>
    );
  },
  Customer: ({ form, settings, value, cb, cbUpFile, suppliers }) => {
    return (
      <Form
        form={form}
        onFinish={cb}
        onFinishFailed={(va) => {
          console.log("va2", va);
        }}
        {...formItemLayout}
      >
        <Form.Item label='Mã khách hàng' name={'code'}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Tên người dùng"
          name="firstName"
        >
          <Input />
        </Form.Item>
        <Form.Item label="Họ" name="lastName">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: "Email là bắt buộc" }, { type: "email", message: "Email ???" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Số điện thoại" name={'phoneNumber'}>
          <Input />
        </Form.Item>
        <Form.Item label="Trạng thái" name="active">
          <Radio.Group options={[
            {
              label: 'Hoạt động',
              value: true
            },
            {
              label: 'Khóa',
              value: false
            }
          ]} />
        </Form.Item>
        <Form.Item label='Địa chỉ' name={'address'}>
          <Input />
        </Form.Item>
        <Form.Item label='Mật khẩu' name={'password'}>
          <Input.Password />
        </Form.Item>
        <Form.Item label="Avatar" name="fileImage" rules={[{ type: "file" }]}>
          <Upload
            beforeUpload={(file) => {
              return false;
            }}
            {...settings.singleFile}
            listType="picture-card"
            onChange={(file) => {
              console.log("change file", file);
              cbUpFile(file);
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
      </Form>
    );
  },
  Slider: ({ form, settings, value, cb, cbUpFile, suppliers, data }) => {
    return (
      <Form
        form={form}
        onFinish={cb}
        onFinishFailed={(va) => {
          console.log("va2", va);
        }}
        {...formItemLayout}
      >
        <Form.Item
          label="Mô tả"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập trường này" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Vị trí" name="typeSlide">
          <Select options={[
            {
              label: 'Slider trung tâm',
              value: "slider"
            },
            {
              label: 'Slider trái',
              value: "slider_left"
            },
            {
              label: 'Slider phải',
              value: "slider_right"
            },
            {
              label: 'banner quảng cáo',
              value: "banner"
            },
          ]} />
        </Form.Item>
        <Form.Item label="Đường dẫn trỏ tới" >
          <Input.Group compact>
            <Form.Item name={['to', 'type']} style={{
              width: '30%',
            }}>
              <Select showSearch filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              } options={[
                {
                  label: 'Sản phẩm',
                  value: 'products'
                },
                {
                  label: 'Danh mục',
                  value: 'categories'
                }
              ]} />
            </Form.Item>
            <Form.Item name={['to', 'link']} style={{
              width: '60%',
            }} >
              <Select showSearch filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              } options={[
                {
                  label: 'Sản phẩm',
                  value: 'products'
                },
                {
                  label: 'Danh mục',
                  value: 'categories'
                }
              ]} />
            </Form.Item>

          </Input.Group>
        </Form.Item>
        <Form.Item label="Trạng thái" name="active">
          <Radio.Group>
            <Radio value={true}> Hoạt động </Radio>
            <Radio value={false}> Khóa </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Hình ảnh" name="fileImage" rules={[{ type: "file" }]}>
          <Upload
            beforeUpload={(file) => {
              return false;
            }}
            {...settings.singleFile}
            listType="picture-card"
            onChange={(file) => {
              console.log("change file", file);
              cbUpFile(file);
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
      </Form>
    );
  },
};

const types = {
  Category: {
    title: "danh mục",
  },
  Slider: {
    title: "trình chiếu,quảng cáo",
  },
  Product: {
    title: "sản phẩm",
  },
  Supplier: {
    title: "nhà cung cấp",
  },
  Order: {
    title: "đơn hàng",
  },
  Employee: {
    title: 'nhân viên'
  },
  Customer: {
    title: 'khách hàng'
  }
};

export const showHandleStatusConfirm = ({
  action = "Xóa",
  type = "",
  value = [],
  cb = async () => { },
}) => {
  confirm({
    title: `${actions[action].title} ${types[type].title} này?`,
    icon: <ExclamationCircleFilled />,
    content: value.map((v) => (
      <p key={v._id} style={{ color: "red" }}>
        {v.name || v.fullname || v.email || v.title}
      </p>
    )),
    okText: actions[action].title,
    okType: actions[action].typeButton,
    cancelText: "Hủy",
    onOk: () => {
      cb(value)
    },
    onCancel() { },
  });
};

export const showPromiseConfirm = ({
  value,
  form,
  type,
  cb,
  cbUpFile,
  cbCate,
  categories = [],
  suppliers = [],
  data = {}
}) => {
  if (value) {
    form.setFieldsValue({
      ...value,
    });
  }
  let settings = {
    singleFile: {
      defaultFileList: [],
    },
    multiFile: {
      defaultFileList: [],
    },
  };
  if (value.coverImgUrl) {
    settings.singleFile.defaultFileList.push({
      uid: "-1",
      name: "old",
      status: "done",
      url: `${process.env.REACT_APP_API_URL}/${value.coverImgUrl}`,
    });
  }
  if (value.Images) {
    let arImg = Object.keys(value.Images);
    arImg.forEach((img, index) =>
      settings.multiFile.defaultFileList.push({
        uid: -index,
        name: img,
        status: "done",
        url: `${process.env.REACT_APP_API_URL}/${value.Images[img]}`,
      })
    );
  }
  confirm({
    title: type,
    icon: <AppstoreAddOutlined />,
    width: "50vw",
    content: (

      <>
        {" "}
        {forms[type]({
          form,
          settings,
          value,
          cb,
          cbUpFile,
          cbCate,
          categories,
          suppliers,
          data
        })}
      </>
    ),
    onOk() {
      form.submit();
    },
    onCancel() {
      form.resetFields();
    },
  });
};

export const HandleSlideShow = ({
  value,
  cb,
  cbUpFile,
  close,
  open,
  cbCate,
  handle
}) => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [optionSlug, setOptionSlug] = useState([])
  const [form] = Form.useForm()
  let settings = {
    singleFile: {
      defaultFileList: [],
    },
    multiFile: {
      defaultFileList: [],
    },
  };
  if (value) {
    console.log("gọi vào đây");
    form.setFieldsValue({
      ...value,
    });
    if (value.coverImgUrl) {
      settings.singleFile.defaultFileList.push({
        uid: "-1",
        name: "old",
        status: "done",
        url: `${process.env.REACT_APP_API_URL}/${value.coverImgUrl}`,
      });
    }
    if (value.Images) {
      let arImg = Object.keys(value.Images);
      arImg.forEach((img, index) =>
        settings.multiFile.defaultFileList.push({
          uid: -index,
          name: img,
          status: "done",
          url: `${process.env.REACT_APP_API_URL}/${value.Images[img]}`,
        })
      );
    }
  }
  useEffect(() => { }, [value])
  function handleSetOptionSlug(type) {
    switch (type) {
      case 'categories':
        setOptionSlug(categories)
        break;
      case 'products':
        setOptionSlug(products)
        break
      default:
        break;
    }
  }

  useEffect(() => {
    async function GetData() {
      const prs = await axiosClient.get('admin/data/products?active=true')
      const cts = await axiosClient.get('admin/data/categories?active=true&slug=true')
      setProducts(prs.data)
      setCategories(cts.data)
    }
    GetData()
  }, [])

  async function handleAddSlide(val) {
    try {
      let file = val.fileImage
      let formData = new FormData();
      if (val.fileImage) {
      }
      formData.append('file', file.file)
      delete val.fileImage
      const rsSlide = await axiosClient.post(`/admin/data/sliders/ADD/add`, val)
      if (rsSlide?.status) {
        message.success('Úp data thành công')
        const rsUpImg = await axiosClient.post(`/admin/upload-single/sliders/${rsSlide.data._id}`, formData)
        message.success('Úp ảnh thành công')
        navigate(0)
      } else return false
    } catch (error) {
      console.log("Lỗi khi thêm slider ", error);
      message.error("Lỗi")
    }
  }
  async function handleUpdateSlide(val) {
    try {
      console.log('cập nhật: ', val);
      let file = val.fileImage
      let formData = new FormData();
      if (file) {
        formData.append('file', file.file)
      }
      delete val.fileImage
      const rsSlide = await axiosClient.patch(`/admin/data/sliders/UPDATE/update/${value._id}`, val)
      if (rsSlide?.status) {
        message.success('Úp data thành công')
        if (file) {
          const rsUpImg = await axiosClient.post(`/admin/upload-single/sliders/${value._id}`, formData)
          message.success('Úp ảnh thành công')

        }
        close()
        navigate(0)
      } else return false
    } catch (error) {
      console.log("Lỗi khi thêm slider ", error);
      message.error("Lỗi")
    }
  }

  function handleSubmit(val) {
    switch (handle) {
      case 'add':
        handleAddSlide(val)
        break;

      default:
        handleUpdateSlide(val)
        break;
    }
  }

  return <Modal
    open={open}
    onOk={() => {
      form.submit()
    }}
    onCancel={() => {
      close()
      form.resetFields()
    }} >
    <Form
      form={form}
      onFinish={(vl) => {
        handleSubmit(vl)
        form.resetFields()
      }}
      onFinishFailed={(va) => {
        console.log("va2", va);
      }}
      {...formItemLayout}
    >
      <Form.Item
        label="Mô tả"
        name="title"
        rules={[{ required: true, message: "Vui lòng nhập trường này" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Vị trí" name="typeSlide">
        <Select options={[
          {
            label: 'Slider trung tâm',
            value: "slider"
          },
          {
            label: 'Slider trái',
            value: "slider_left"
          },
          {
            label: 'Slider phải',
            value: "slider_right"
          },
          {
            label: 'banner quảng cáo',
            value: "banner"
          },
        ]} />
      </Form.Item>
      <Form.Item label="Đường dẫn trỏ tới" >
        <Input.Group compact>
          <Form.Item name={['to', 'type']} style={{
            width: '30%',
          }}>
            <Select showSearch filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            } options={[
              {
                label: 'Sản phẩm',
                value: 'products'
              },
              {
                label: 'Danh mục',
                value: 'categories'
              }
            ]}
              onChange={handleSetOptionSlug}
            />
          </Form.Item>
          <Form.Item name={['to', 'link']} style={{
            width: '60%',
          }} >
            <Select showSearch filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            } options={optionSlug.map(sl => ({
              label: sl.name,
              value: sl.slug
            }))} />
          </Form.Item>

        </Input.Group>
      </Form.Item>
      <Form.Item label="Trạng thái" name="active">
        <Radio.Group>
          <Radio value={true}> Hoạt động </Radio>
          <Radio value={false}> Khóa </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Hình ảnh" name="fileImage" rules={[{ type: "file" }]}>
        <Upload
          beforeUpload={(file) => {
            return false;
          }}
          {...settings.singleFile}
          listType="picture-card"
          onChange={(file) => {
            console.log("change file", file);
            cbUpFile(file);
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
    </Form>
  </Modal>

}
