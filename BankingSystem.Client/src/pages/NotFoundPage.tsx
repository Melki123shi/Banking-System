import React from "react";
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";
import { Button, Result } from "antd";
export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  // Logic to safely extract a message from the 'unknown' error type
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    // error is from a loader/action (contains statusText or data)
    errorMessage =
      error.statusText || error.data?.message || "Unknown Route Error";
  } else if (error instanceof Error) {
    // standard JS error
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    errorMessage = "An unexpected error occurred";
  }

  return (
    <div className="mt-48 items-center">
      <Result
        status="404"
        title="404"   
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={
          () => {
            navigate("/login")
          }
        }>Back Home</Button>}
      />
    </div>
  );
};

export default NotFoundPage;
