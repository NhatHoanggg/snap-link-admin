"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Camera, Calendar, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { getMonthlyComparison } from "@/services/dashboard.service"

export function DashboardCards() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPhotographers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    userGrowth: 0,
    bookingGrowth: 0,
    revenueGrowth: 0,
    photographerGrowth: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        const response = await getMonthlyComparison()
        console.log("Dashboard Response:", response)
        
        // Calculate growth percentages
        const calculateGrowth = (current: number, previous: number) => {
          if (previous === 0) return 0
          return ((current - previous) / previous) * 100
        }

        const { current_month, previous_month } = response
        
        setStats({
          totalUsers: current_month.total_users,
          totalPhotographers: current_month.total_photographers,
          totalBookings: current_month.total_bookings,
          totalRevenue: current_month.total_revenue,
          userGrowth: calculateGrowth(current_month.total_users, previous_month.total_users),
          bookingGrowth: calculateGrowth(current_month.total_bookings, previous_month.total_bookings),
          revenueGrowth: calculateGrowth(current_month.total_revenue, previous_month.total_revenue),
          photographerGrowth: calculateGrowth(current_month.total_photographers, previous_month.total_photographers),
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        // Reset stats to default values in case of error
        setStats({
          totalUsers: 0,
          totalPhotographers: 0,
          totalBookings: 0,
          totalRevenue: 0,
          userGrowth: 0,
          bookingGrowth: 0,
          revenueGrowth: 0,
          photographerGrowth: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatGrowth = (value: number) => {
    return value.toFixed(1)
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-5 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {stats.userGrowth > 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+{formatGrowth(stats.userGrowth)}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-red-500">{formatGrowth(stats.userGrowth)}%</span>
              </>
            )}
            <span className="ml-1">so với tháng trước</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nhiếp ảnh gia</CardTitle>
          <Camera className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPhotographers}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {stats.photographerGrowth > 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+{formatGrowth(stats.photographerGrowth)}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-red-500">{formatGrowth(stats.photographerGrowth)}%</span>
              </>
            )}
            <span className="ml-1">so với tháng trước</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lịch đặt</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBookings}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {stats.bookingGrowth > 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+{formatGrowth(stats.bookingGrowth)}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-red-500">{formatGrowth(stats.bookingGrowth)}%</span>
              </>
            )}
            <span className="ml-1">so với tháng trước</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {stats.revenueGrowth > 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+{formatGrowth(stats.revenueGrowth)}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-red-500">{formatGrowth(stats.revenueGrowth)}%</span>
              </>
            )}
            <span className="ml-1">so với tháng trước</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
