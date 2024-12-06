import App from "@/App";
import AdminLogin from "@/components/AdminLogin";
import Login from "@/components/Login";
import Register from "@/components/Register";
import CartPage from "@/pages/books/CartPage";
import CheckoutPage from "@/pages/books/CheckoutPage";
import OrderPage from "@/pages/books/OrderPage";
import OrderSuccess from "@/pages/books/OrderSuccess";
import SingleBook from "@/pages/books/SingleBook";
import AddBook from "@/pages/dashboard/addBook/AddBook";
import Dashboard from "@/pages/dashboard/Dashboard";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import UpdateBook from "@/pages/dashboard/EditBook/UpdateBook";
import ManageBooks from "@/pages/dashboard/manageBooks/ManageBooks";
import UserDashboard from "@/pages/dashboard/users/UserDashboard";
import FavoriteBooks from "@/pages/home/FavoriteBooks";
import Home from "@/pages/home/Home";
import { QueryProvider } from "@/providers/query-client";
import AdminRoute from "@/routers/AdminRoute";
import PrivateRoute from "@/routers/PrivateRoute";
import { createBrowserRouter, RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/orders",
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/about",
        element: <div>About</div>,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/checkout",
        element: (
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/order-success",
        element: (
          <PrivateRoute>
            <OrderSuccess />
          </PrivateRoute>
        ),
      },
      {
        path: "/books/:id",
        element: <SingleBook />,
      },
      {
        path: "/user-dashboard",
        element: (
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/favorites",
        element: (
          <PrivateRoute>
            <FavoriteBooks />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <QueryProvider>
        <AdminLogin />
      </QueryProvider>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      {
        path: "",
        element: (
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        ),
      },
      {
        path: "add-new-book",
        element: (
          <AdminRoute>
            <AddBook />
          </AdminRoute>
        ),
      },
      {
        path: "edit-book/:id",
        element: (
          <AdminRoute>
            <UpdateBook />
          </AdminRoute>
        ),
      },
      {
        path: "manage-books",
        element: (
          <AdminRoute>
            <ManageBooks />
          </AdminRoute>
        ),
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
