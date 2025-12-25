import React, { useState } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { Card, Image, Form, Input, message, Typography, Button } from "antd";
import LogoImage from "@/assets/logo.png";
import { useEffect } from "react";
import { useLogin } from "@/hooks/useAuth";
import { PhoneOutlined, LockOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/stores/authStore";

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const loginMutation = useLogin();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    try {
      const decoded = jwtDecode<any>(accessToken);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;

      if (role === "Admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Invalid token", error);
    }
  }, [accessToken, navigate]);

  const onFinish = (values: { phoneNumber: string; password: string }) => {
    setLoading(true);
    loginMutation.mutate(values, {
      onError: () => {
        message.error("Invalid phone number or password");
        setLoading(false);
      },
      onSuccess: () => {
        message.success("Login successful");
        setLoading(false);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card
        style={{
          borderColor: "#01305c",
          // backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
        className="w-full max-w-md p-8 shadow-lg"
      >
        <div className="text-center mb-8">
          <Image src={LogoImage} preview={false} />
          <Title
            level={2}
            style={{
              margin: 0,
              marginBottom: 8,
              color: "#41e1fb",
            }}
            className="text-xl font-medium text-[#143d64] px-7"
          >
            Welcome Back <br />
          </Title>
          <Text style={{ color: "#333" }}>
            we are happy to see you again! 😊
          </Text>
        </div>

        <Form
          name="login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Phone Number"
              // style={{ backgroundColor: "transparent", color: "#ddd" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              // style={{ backgroundColor: "transparent", color: "#fff" }}
            />
          </Form.Item>
          <br />

          <Form.Item>
            <Button
              style={{
                backgroundColor: "#01305c",
                borderColor: "#01305c",
                color: "#cae3fb",
              }}
              htmlType="submit"
              block
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>

          <div className="text-center text-xs text-slate-400">
            <p>
              Demo: Customer (1234567890 / user), <br /> Admin (+255675757575 /
              adam@1234)
            </p>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
