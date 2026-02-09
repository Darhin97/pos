"use client";

import { useRouter } from "next/navigation";
import { Login } from "@/components/auth/Login";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/dashboard/orders");
  };

  return <Login onLogin={handleLogin} />;
}
