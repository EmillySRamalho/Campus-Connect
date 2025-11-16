"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { LoadingPage } from "@/components/Loading/LoadingPage";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { loading, token } = useAuthContext();

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/account");
    }
  }, [loading, token]);

  if (loading) return <LoadingPage />;
  if (!token) return null;

  return <>{children}</>;
}
