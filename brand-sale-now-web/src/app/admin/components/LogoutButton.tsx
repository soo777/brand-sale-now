"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/lib/api/auth";

export function LogoutButton() {
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      console.error("로그아웃 중 오류:", error);
    },
  });

  return (
    <Button
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
      className="px-4 py-2 text-sm disabled:opacity-50"
    >
      {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
    </Button>
  );
}
