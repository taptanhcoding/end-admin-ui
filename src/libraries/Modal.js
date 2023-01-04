import { Modal, Form, Input, Image, Upload, Select } from "antd";
import {
  ExclamationCircleFilled,
  AppstoreAddOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React from "react";

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
  Restore: {
    title: "Khôi phục",
    typeButton: "default",
  },
};

const forms = {
  Category: ({ form, settings, value, cb, cbUpFile }) => {
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
        <Form.Item label="Icon mới" name="fileImage" rules={[{ type: "file" }]}>
          <Upload
            beforeUpload={(file) => {
              return false;
            }}
            {...settings}
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
        <Form.Item
          label="Hình đại diện"
          name="fileImage"
          rules={[{ type: "file" }]}
        >
          <Upload
            beforeUpload={(file) => {
              return false;
            }}
            {...settings}
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
        <Form.Item
          label="Slide mô tả"
          name="fileImages"
          rules={[{ type: "file" }]}
        >
          <Upload
            beforeUpload={(file) => {
              return false;
            }}
            {...settings}
            listType="picture-card"
            onChange={(file) => {}}
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
  Product: ({ form, settings, value, cb, cbUpFile, categories, suppliers }) => {
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
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập trường này" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Giá"
          name="price"
          rules={[
            {
              type: "float",
            },
            {
              validator: async (p) => {
                return p >= 0
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
            {
              type: "float",
            },
            {
              validator: async (p) => {
                return p >= 0 && p <= 75
              },
              message: "Khuyến mãi không âm và vượt quá 75% giá sản phẩm",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Tồn"
          name="stock"
          rules={[
            {
              type: "float",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Danh mục" name='categoryId' >
          <Select showSearch options={categories.map(category => ({value: category._id,label: category.name}))}/>
        </Form.Item>
        <Form.Item label="Nguồn" name='supplierId' >
          <Select showSearch options={suppliers.map(supplier => ({value: supplier._id,label: supplier.name}))}/>
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>
        <Form.Item label="Icon mới" name="fileImage" rules={[{ type: "file" }]}>
          <Upload
            beforeUpload={(file) => {
              return false;
            }}
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
  Product: {
    title: "sản phẩm",
  },
  Supplier: {
    title: "nhà cung cấp",
  },
  Order: {
    title: "đơn hàng",
  },
};

export const showHandleStatusConfirm = ({
  action = "Xóa",
  type = "",
  value = [],
  cb = async () => {},
}) => {
  confirm({
    title: `${actions[action].title} ${types[type].title} này?`,
    icon: <ExclamationCircleFilled />,
    content: value.map((v) => (
      <p key={v._id} style={{ color: "red" }}>
        {v.name}
      </p>
    )),
    okText: actions[action].title,
    okType: actions[action].typeButton,
    cancelText: "Hủy",
    onOk: () => {
      if (value.length > 1) {
        cb(value);
      } else {
        let [a] = value;
        cb(a);
      }
    },
    onCancel() {},
  });
};

export const showPromiseConfirm = ({
  value,
  form,
  type,
  cb,
  cbUpFile,
  categories = [],
  suppliers = [],
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
      settings.singleFile.defaultFileList.push({
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
          categories,
          suppliers,
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
