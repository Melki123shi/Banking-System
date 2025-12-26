import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { createBrowserRouter, RouterProvider } from "react-router";

import App from "./App";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { RoleRoute } from "./routes/RoleRoute";

import "./index.css";
import LoginPage from "./pages/Login";


const router = createBrowserRouter([
  {
    element: <App />, 
    children: [
      {
        path: "/login",
        element: <AdminDashboard />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/admin",
            element: (
              <RoleRoute role="Admin">
                <AdminDashboard />
              </RoleRoute>
            ),
          },
          {
            path: "/",
            element: <UserDashboard />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
