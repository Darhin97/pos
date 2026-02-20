"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OpenClosePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the register page
    router.push("/dashboard/register");
  }, [router]);

  return null;
}
