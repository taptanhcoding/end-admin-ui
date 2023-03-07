import React, { useEffect, useLayoutEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../../libraries/axiosClient";
import ModalConfirmUpdate from '../components/modalConfirmUpdate'

import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Switch,
  TreeSelect,
  Upload,
  Col,
  notification
} from 'antd';
const { RangePicker } = DatePicker;
const { TextArea } = Input;

function Profile() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [form] = Form.useForm()
  const [changePass, setChangePass] = useState(false)
  const [password, setPassword] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [defaultFile, setDefaultFile] = useState({})
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
  const [componentDisabled, setComponentDisabled] = useState(false);
  useEffect(() => {
    async function getProfile() {
      const profile = await axiosClient.get('/admin/profile/' + id)
      setDefaultFile({
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: `${process.env.REACT_APP_API_URL}/${profile.data.coverImgUrl}`,
      })
      setData(profile.data)
    }
    getProfile()
  }, [id])
  useEffect(() => {
    form.setFieldsValue(data)
  }, [data])
  async function handleUpdate(value) {
    value.password = password
    value.birthday = value.birthday ? new Date(value.birthday['$y'], value.birthday['$m'], value.birthday['$D']) : null
    let formFile = new FormData()
    let newVl = { ...data, ...value }
    if (newVl.coverImgUrl) {
      formFile.append('file', newVl.coverImgUrl.file)
      delete newVl.coverImgUrl
    }
    try {
      const result = await axiosClient.patch(`admin/profile/${newVl._id}?changepass=${changePass}`, newVl)
      console.log('trả về', result);
      if (result.status) {
        notification.info(result.message)
        const resultUpdate = await axiosClient.post(`admin/upload-single/employees/${newVl._id}`, formFile)
      }
      navigate(0)
    } catch (error) {
      console.log('Lỗi cập nhật profile : ', error);
    }
  }

  return (

    <>
      {data && <div style={{ 'width': '100vw' }}>
        <Checkbox
          checked={componentDisabled}
          onChange={(e) => setComponentDisabled(e.target.checked)}
        >
          Chỉnh sửa
        </Checkbox>
        <Form
          {...formItemLayout}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          disabled={!componentDisabled}
          style={{
            width: '100%',
          }}
          onFinish={handleUpdate}
          onFinishFailed={value => {
            console.log('dataSMF', value);
          }}
          form={form}

        >
          <Form.Item label="Trạng thái" name='active'>
            <Radio.Group>
              <Radio value={true}> Hoạt động </Radio>
              <Radio value={false}> Khóa </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Họ" name='firstName'>
            <Input />
          </Form.Item>
          <Form.Item label="Tên" name='lastName'>
            <Input />
          </Form.Item>

          <Form.Item label="Avatar" name="coverImgUrl" rules={[{ type: "file" }]}>
            <Upload
              beforeUpload={(file) => {
                return false;
              }}
              listType="picture-card"
              onChange={(file) => {
                console.log("change file", file);
              }}
              defaultFileList={[defaultFile]}
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
            <TreeSelect
              treeData={[
                {
                  title: 'Light',
                  value: 'light',
                  children: [
                    {
                      title: 'Bamboo',
                      value: 'bamboo',
                    },
                  ],
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="Kích hoạt lần cuối" name='lastActive'>
            <Input disabled />
          </Form.Item>
          <Form.Item label="Điện thoại" name='phoneNumber'>
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ" name='address'>
            <Input />
          </Form.Item>
          <Form.Item label="Sinh nhật" name='birthday'>
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
          <Form.Item label="Đổi mật khẩu" >
            <Button onClick={() => { setChangePass(prev => !prev) }}>Bấm vào đây</Button>
          </Form.Item>
          {changePass && <>
            <Form.Item label="Mật khẩu mới" name={['newPass']} rules={[{ required: true, message: "Bạn phải nhập trường này" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Nhập lại Mật khẩu mới" name={['rpNewPass']} rules={[{ required: true, message: "Bạn phải nhập trường này" }]}>
              <Input />
            </Form.Item>
          </>}
          <Form.Item >
            <Button onClick={() => { setOpenModal(true) }}>Thay đổi thông tin</Button>
          </Form.Item>
        </Form>
        <ModalConfirmUpdate isOpen={openModal} handleSubmit={() => {
          form.submit()
          setOpenModal(false)
        }} setPassword={setPassword} onClose={setOpenModal.bind(null, false)} />
      </div>}
    </>


  );
}

export default Profile;