import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import getBaseUrl from "../utils/baseURL";

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

const AdminLogin: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const navigate = useNavigate();

  const loginMutation = useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: (data) =>
      axios
        .post<AuthResponse>(`${getBaseUrl()}/api/users/admin`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => response.data),
    onSuccess: (auth) => {
      if (auth.token) {
        localStorage.setItem("admin_token", auth.token);
        toast.success("Admin login Successful", {
          description: "Navigating to dashboard...",
          position: "top-right",
          duration: 1500,
        });
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      toast.error("Login Failed", {
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || "Invalid credentials"
          : "An unexpected error occurred",
        position: "top-right",
      });
      console.error("Login error:", error);
    },
  });

  const onSubmit: SubmitHandler<LoginCredentials> = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
          Admin Dashboard Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username
            </label>
            <input
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              })}
              type="text"
              id="username"
              placeholder="Enter username"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: 5,
              })}
              type="password"
              id="password"
              placeholder="Enter password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-gray-500 text-xs">
          ©2025 Book Store. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
