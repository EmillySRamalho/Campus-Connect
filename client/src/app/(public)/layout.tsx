"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { LoadingPage } from "@/components/Loading/LoadingPage";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && token) {
      router.replace("/");
    }
  }, [token, loading]);

  if (loading) return <LoadingPage />;
  if (token) return null;

  return <>{children}</>;
}
