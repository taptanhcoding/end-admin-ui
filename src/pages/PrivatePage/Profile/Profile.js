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
      console.log('tr??? v???', result);
      if (result.status) {
        notification.info(result.message)
        const resultUpdate = await axiosClient.post(`admin/upload-single/employees/${newVl._id}`, formFile)
      }
      navigate(0)
    } catch (error) {
      console.log('L???i c???p nh???t profile : ', error);
    }
  }

  return (

    <>
      {data && <div style={{ 'width': '100vw' }}>
        <Checkbox
          checked={componentDisabled}
          onChange={(e) => setComponentDisabled(e.target.checked)}
        >
          Ch???nh s???a
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
          <Form.Item label="Tr???ng th??i" name='active'>
            <Radio.Group>
              <Radio value={true}> Ho???t ?????ng </Radio>
              <Radio value={false}> Kh??a </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="H???" name='firstName'>
            <Input />
          </Form.Item>
          <Form.Item label="T??n" name='lastName'>
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
                  Ch???n h??nh ???nh
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
          <Form.Item label="K??ch ho???t l???n cu???i" name='lastActive'>
            <Input disabled />
          </Form.Item>
          <Form.Item label="??i???n tho???i" name='phoneNumber'>
            <Input />
          </Form.Item>
          <Form.Item label="?????a ch???" name='address'>
            <Input />
          </Form.Item>
          <Form.Item label="Sinh nh???t" name='birthday'>
            <DatePicker />
          </Form.Item>
          <Form.Item label="M?? ch???c v???" name={['roles', 'pos']}>
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
          <Form.Item label="Ch???c v???" name={['roles', 'title']}>
            <Input
            />
          </Form.Item>
          <Form.Item label="Cho ph??p thay ?????i ph??n quy???n" name={['enableEditRoles']}>
            <Radio.Group options={[{
              label: 'Cho ph??p',
              value: true
            }, {
              label: "Kh??ng cho ph??p",
              value: false
            }]} optionType="button" />
          </Form.Item>
          <Form.Item label="Ph??n quy???n" name={['roles', 'auth']}>
            <Form.Item label='Nh?? cung c???p' name={['roles', 'auth', 'suppliers']} style={{ display: "flex", 'flexDirection': 'row' }}>
              <Checkbox.Group options={[{
                label: "L???y danh s??ch",
                value: 'GET'
              }, {
                label: "Th??m",
                value: "ADD"
              },
              {
                label: "S???a",
                value: "UPDATE"
              },
              {
                label: "X??a",
                value: "DELETE"
              }
              ]} />
            </Form.Item>
            <Form.Item label='Danh m???c' name={['roles', 'auth', 'categories']} style={{ display: "flex", 'flexDirection': 'row' }}>
              <Checkbox.Group options={[{
                label: "L???y danh s??ch",
                value: 'GET'
              }, {
                label: "Th??m",
                value: "ADD"
              },
              {
                label: "S???a",
                value: "UPDATE"
              },
              {
                label: "X??a",
                value: "DELETE"
              }
              ]} />
            </Form.Item>
            <Form.Item label='S???n ph???m' name={['roles', 'auth', 'products']} style={{ display: "flex", 'flexDirection': 'row' }}>
              <Checkbox.Group options={[{
                label: "L???y danh s??ch",
                value: 'GET'
              }, {
                label: "Th??m",
                value: "ADD"
              },
              {
                label: "S???a",
                value: "UPDATE"
              },
              {
                label: "X??a",
                value: "DELETE"
              }
              ]} />
            </Form.Item>
            <Form.Item label='Ng?????i d??ng' name={['roles', 'auth', 'customers']} style={{ display: "flex", 'flexDirection': 'row' }}>
              <Checkbox.Group options={[{
                label: "L???y danh s??ch",
                value: 'GET'
              }, {
                label: "Th??m",
                value: "ADD"
              },
              {
                label: "S???a",
                value: "UPDATE"
              },
              {
                label: "X??a",
                value: "DELETE"
              }
              ]} />
            </Form.Item>
            <Form.Item label='B??n h??ng' name={['roles', 'auth', 'orders']} style={{ display: "flex", 'flexDirection': 'row' }}>
              <Checkbox.Group options={[{
                label: "L???y danh s??ch",
                value: 'GET'
              }, {
                label: "Th??m",
                value: "ADD"
              },
              {
                label: "S???a",
                value: "UPDATE"
              },
              {
                label: "X??a",
                value: "DELETE"
              }
              ]} />
            </Form.Item>
            <Form.Item label='Nh??n vi??n' name={['roles', 'auth', 'employees']} style={{ display: "flex", 'flexDirection': 'row' }}>
              <Checkbox.Group options={[{
                label: "L???y danh s??ch",
                value: 'GET'
              }, {
                label: "Th??m",
                value: "ADD"
              },
              {
                label: "S???a",
                value: "UPDATE"
              },
              {
                label: "X??a",
                value: "DELETE"
              }
              ]} />
            </Form.Item>
            <Form.Item label='Slider' name={['roles', 'auth', 'sliders']} style={{ display: "flex", 'flexDirection': 'row' }}>
              <Checkbox.Group options={[{
                label: "L???y danh s??ch",
                value: 'GET'
              }, {
                label: "Th??m",
                value: "ADD"
              },
              {
                label: "S???a",
                value: "UPDATE"
              },
              {
                label: "X??a",
                value: "DELETE"
              }
              ]} />
            </Form.Item>
            <Form.Item label='B??nh lu???n' name={['roles', 'auth', 'comments']} style={{ display: "flex", 'flexDirection': 'row' }}>
              <Checkbox.Group options={[{
                label: "L???y danh s??ch",
                value: 'GET'
              }, {
                label: "Th??m",
                value: "ADD"
              },
              {
                label: "S???a",
                value: "UPDATE"
              },
              {
                label: "X??a",
                value: "DELETE"
              }
              ]} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="?????i m???t kh???u" >
            <Button onClick={() => { setChangePass(prev => !prev) }}>B???m v??o ????y</Button>
          </Form.Item>
          {changePass && <>
            <Form.Item label="M???t kh???u m???i" name={['newPass']} rules={[{ required: true, message: "B???n ph???i nh???p tr?????ng n??y" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Nh???p l???i M???t kh???u m???i" name={['rpNewPass']} rules={[{ required: true, message: "B???n ph???i nh???p tr?????ng n??y" }]}>
              <Input />
            </Form.Item>
          </>}
          <Form.Item >
            <Button onClick={() => { setOpenModal(true) }}>Thay ?????i th??ng tin</Button>
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