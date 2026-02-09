"use client";

import { FormEvent } from "react";
import Link from "next/link";
import { AuthLayout } from "./AuthLayout";
import { InputField } from "../shared/InputField";
import { Icon } from "../shared/Icon";

interface LoginProps {
  onLogin: () => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access the dashboard."
      footer={
        <div className="mt-6 text-center text-xs text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign up
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Company Name"
          placeholder="Acme Inc."
          icon="Building2"
        />
        <InputField
          label="Username"
          placeholder="johndoe"
          icon="User"
        />
        <InputField
          label="Password"
          type="password"
          placeholder="••••••••"
          icon="Lock"
        />

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20"
            />
            <span className="text-xs text-gray-500">Remember me</span>
          </label>
          <a
            href="#"
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-sm shadow-blue-600/20 hover:bg-blue-700 hover:shadow-md transition-all flex items-center justify-center gap-2 group"
        >
          <span>Sign In</span>
          <Icon
            name="ArrowRight"
            size={16}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </form>
    </AuthLayout>
  );
};
