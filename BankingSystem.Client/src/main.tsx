import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { createBrowserRouter, RouterProvider } from "react-router";

import App from "./App";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RoleRoute } from "./routes/RoleRoute";

import "./index.css";
import LoginPage from "./pages/Login";
import UsersPage from "./pages/UsersPage";
import AccountsPage from "./pages/AccountsPage";
import TransactionsPage from "./pages/TransactionsPage";
import AdminLayout from "./components/admin/AdminLayout";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <UserDashboard />,
          },

          {
            path: "/admin",
            element: (
              <RoleRoute role="Admin">
                <AdminLayout />
              </RoleRoute>
            ),
            children: [
              {
                index: true,
                element: <AdminDashboard />,
              },
              {
                path: "customers",
                element: <UsersPage />,
              },
              {
                path: "accounts",
                element: <AccountsPage />,
              },
              {
                path: "transactions",
                element: <TransactionsPage />,
              },
            ],
          },
        ],
      },

      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
