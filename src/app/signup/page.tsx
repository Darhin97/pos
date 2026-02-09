"use client";

import { useRouter } from "next/navigation";
import { Signup } from "@/components/auth/Signup";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = () => {
    router.push("/dashboard/orders");
  };

  return <Signup onSignup={handleSignup} />;
}
