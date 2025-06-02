"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AdminLandingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  if (session) {
    router.push("/dashboard");
  }
  return (
    <main className="w-screen h-screen bg-background text-foreground flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="mb-6">
          <motion.img
            src="/logo.svg"
            alt="Logo"
            className="mx-auto h-16"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>

        <motion.h1
          className="text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Chào mừng đến với trang quản trị
        </motion.h1>

        <motion.p
          className="text-lg mb-8 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Quản lý hệ thống một cách dễ dàng và hiệu quả với giao diện hiện đại.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground" onClick={() => router.push("/login")}>
            Đăng nhập
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
