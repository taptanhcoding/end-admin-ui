import { Button, Checkbox, Form, Input, message } from "antd";
import axiosClient from "../../libraries/axiosClient";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const { email, password } = values;
    try {
      const login = await axiosClient.post("/admin/login", {
        email,
        password,
      });
      message.info(login.message);
      navigate("/");
    } catch (error) {
      message.error(error.response.data.message)
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      style={{
        width: "80vw",
      }}
    >
      <Form.Item
        label="Email"
        name="email"
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please input your username!",
          },
          {
            type: "email",
            message: "Vui lòng nhập email có dạng abc@gmail.com",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Login;
