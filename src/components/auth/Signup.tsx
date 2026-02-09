"use client";

import { FormEvent } from "react";
import Link from "next/link";
import { AuthLayout } from "./AuthLayout";
import { InputField } from "../shared/InputField";
import { Icon } from "../shared/Icon";

interface SignupProps {
  onSignup: () => void;
}

export const Signup = ({ onSignup }: SignupProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSignup();
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start managing your inventory in seconds."
      footer={
        <div className="mt-6 text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Log in
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Full Name"
          placeholder="John Doe"
          icon="UserCircle"
        />
        <InputField
          label="Company Name"
          placeholder="Acme Inc."
          icon="Building2"
        />
        <InputField
          label="Password"
          type="password"
          placeholder="Create a strong password"
          icon="Lock"
        />

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-sm shadow-blue-600/20 hover:bg-blue-700 hover:shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            <span>Get Started</span>
            <Icon
              name="ArrowRight"
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 leading-relaxed px-4">
          By clicking &quot;Get Started&quot; you agree to our Terms of Service
          and Privacy Policy.
        </p>
      </form>
    </AuthLayout>
  );
};
