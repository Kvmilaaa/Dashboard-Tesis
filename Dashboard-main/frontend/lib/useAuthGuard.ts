"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuthGuard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem("auth_token");
    const savedUsername = window.localStorage.getItem("auth_username") ?? "";

    if (!token) {
      router.replace("/login");
      return;
    }

    setUsername(savedUsername);
    setReady(true);
  }, [router]);

  return { ready, username };
}
