import React, { useEffect } from "react";
import { Card, Form, Input, Button, Typography, message, Image } from "antd";
import { PhoneOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useLogin } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import LogoImage from "@/assets/logo.png";

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return;

    if (user.role === "Admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const onFinish = (values: { phoneNumber: string; password: string }) => {
    loginMutation.mutate(values, {
      onError: () => message.error("Invalid phone number or password"),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          {" "}
          <Image src={LogoImage} preview={false} />{" "}
          <Title
            level={2}
            style={{ margin: 0, marginBottom: 8, color: "#41e1fb" }}
            className="text-xl font-medium text-[#143d64] px-7"
          >
            {" "}
            Welcome Back <br />{" "}
          </Title>{" "}
          <Text style={{ color: "#333" }}>
            {" "}
            we are happy to see you again! 😊{" "}
          </Text>{" "}
        </div>

        <Form layout="vertical" size="large" onFinish={onFinish}>
          <Form.Item
            name="phoneNumber"
            rules={[{ required: true, message: "Phone number required" }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Password required" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              block
              loading={loginMutation.isPending}
            >
              Sign In
            </Button>
          </Form.Item>
          <div className="text-center text-xs text-slate-400">
            {" "}
            <p>
              {" "}
              Demo: Customer (+25992996677 / 1234), <br /> Admin (+25991996677
              / admin@1234){" "}
            </p>{" "}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
