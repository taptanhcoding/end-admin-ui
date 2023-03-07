import { Button, Modal, Space, Form, Input } from 'antd';
import { InfoCircleOutlined } from "@ant-design/icons"

function ModalConfirmUpdate({ handleSubmit, setPassword, isOpen, onClose }) {
    const [form] = Form.useForm()

    return <Modal title='Xác nhận cập nhật' open={isOpen} onOk={() => {

        form.submit()
    }} onCancel={onClose}>
        <Form form={form} onFinish={value => {
            setPassword(value.password)
            handleSubmit()
            form.resetFields()
        }}>
            <Form.Item label='Xác nhận mật khẩu' name={'password'} rules={[{required: true,message:"Bạn phải nhập mật khẩu !!"}]}>
                <Input.Password />
            </Form.Item>
        </Form>
    </Modal>
}

export default ModalConfirmUpdate;