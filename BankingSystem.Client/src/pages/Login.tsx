import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Card, Image, Form, Input, message, Typography, Button } from "antd";
import LogoImage from "@/assets/logo.png";
import { useEffect } from "react";
import { useLogin } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useUser";
import { PhoneOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const loginMutation = useLogin();
  const { data: user } = useCurrentUser();

  /* ------------------ Navigate once user is loaded ------------------ */
  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const onFinish = (values: { phoneNumber: string; password: string }) => {
    setLoading(true);
    loginMutation.mutate(values, {
      onError: () => {
        message.error("Invalid phone number or password");
      },
      onSuccess: () => {
        message.success("Login successful");
      },
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-135 from-[#1a1a1a] to-[#2d2d2d]">
      <Card
        style={{
          borderColor: "#01305c",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
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
              color: "#cae3fb",
            }}
            className="text-xl font-medium text-[#cae3fb] px-7"
          >
            Welcome Back <br />
          </Title>
          <Text style={{ color: "#ccc" }}>we are happy to see you again! 😊</Text>
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
            name="phone"
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
              style={{backgroundColor: "transparent", color: "#ddd"} }
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
              style={{backgroundColor: "transparent", color: "#fff"} }

            />
          </Form.Item>
          <br />

          <Form.Item>
            <Button style={{ backgroundColor: "#01305c", borderColor: "#01305c", color: "#cae3fb" }} htmlType="submit" block loading={loading}>
              Sign In
            </Button>
          </Form.Item>

          <div className="text-center text-xs text-slate-400">
            <p>Demo: User (1234567890 / user), Admin (admin / admin)</p>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
