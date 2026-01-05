import React, { useEffect } from "react";
import { Card, Form, Input, Button, Typography, message, Image } from "antd";
import { PhoneOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useLogin } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import LogoImage from "@/assets/logo.png";
import { useThemeStore } from "@/stores/themeStore";
import { Layout as AntLayout } from "antd";
import { validateEthioPhone } from "@/lib/validation";
import bg from "../assets/bg.jpg";
import bgDark from "../assets/bg-dark.jpg";

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const loginMutation = useLogin();
  const user = useAuthStore((state) => state.user);

  console.log(user, "-------------------<>")

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
    <AntLayout 
      style={{ 
        minHeight: '100vh', 
        backgroundImage: `${isDarkMode ? "url(" + bgDark + ")" :"url(" + bg + ")"}`,
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          {" "}
          <Image src={LogoImage} preview={false} />{" "}
          <Title
            level={3}
            style={{ margin: 0, marginBottom: 8, color: isDarkMode ? "#41e1fb" : "#143d64" }}
            className="text-xl font-medium text-[#143d64] px-7"
          >
            {" "}
            Welcome Back <br />{" "}
          </Title>{" "}
          <Text style={{ color: isDarkMode ? "#999" : "#333" }}>
            {" "}
            we are happy to see you again! 😊{" "}
          </Text>{" "}
        </div>

        <Form layout="vertical" size="large" onFinish={onFinish} className="px-3">
          <Form.Item
            name="phoneNumber"
            rules={[{ required: true,
               validator: validateEthioPhone
               }]}
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
              Demo: Customer (+251996670943 / 1234), <br /> Admin (+251918996677
              / 1234){" "}
            </p>{" "}
          </div>
        </Form>
      </Card>
    </AntLayout>
  );
};

export default LoginPage;
