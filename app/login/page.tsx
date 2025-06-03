"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, LinkIcon } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/services/auth"

export default function LoginPage() {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login(formData.email, formData.password)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Đăng nhập thất bại"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <div className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-2xl bg-card shadow-2xl lg:grid-cols-2 top-0">
          {/* Left side - Image and branding */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent"></div>
            <div className="absolute inset-0 opacity-10 mix-blend-overlay">
              <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <pattern
                  id="pattern-circles"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                  patternContentUnits="userSpaceOnUse"
                >
                  <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#000"></circle>
                </pattern>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
              </svg>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-primary-foreground">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-center"
              >
                {/* <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-foreground/20 backdrop-blur-sm">
                  <LinkIcon className="h-10 w-10 text-primary-foreground" />
                </div> */}
                <h2 className="mb-2 text-3xl font-bold">SnapLink 📸</h2>
                <p className="mb-8 text-primary-foreground/80">Kết nối nhanh chóng. Chia sẻ dễ dàng.</p>
                <div className="relative h-64 w-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1.2 }}
                    transition={{ delay: 0.5, duration: 1.2 }}
                    className="absolute left-0 top-0 h-48 w-48 rounded-lg bg-primary-foreground/10 backdrop-blur-sm"
                  ></motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1.1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="absolute bottom-0 right-0 h-48 w-48 rounded-lg bg-primary-foreground/10 backdrop-blur-sm"
                  ></motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-primary-foreground/20 p-2 backdrop-blur-sm"
                  >

                    <Image src="/logo.svg" alt="SnapLink" width={200} height={200} />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="flex flex-col justify-center p-4 sm:p-8 md:p-12 --primary-foreground/30">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto w-full max-w-md"
            >
              <div className="mb-8 text-center lg:hidden">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                  <LinkIcon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-foreground">SnapLink 📸</h2>
                <p className="text-muted-foreground">Kết nối nhanh chóng. Chia sẻ dễ dàng.</p>
              </div>

              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Chào mừng trở lại! 🎉🎉🎉</h1>
                <p className="mt-2 text-muted-foreground">Vui lòng đăng nhập để tiếp tục</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 h-12 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground">
                        Mật khẩu
                      </Label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 h-12 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>

               
              </form>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
