// DashboardCharts.tsx using Recharts
"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { 
  getRevenueData, 
  getBookingData, 
  getUserDistributionData, 
  getBookingStatusData,
  type RevenueDataPoint,
  type BookingDataPoint,
  type UserDistributionDataPoint,
  type BookingStatusDataPoint
} from "@/services/dashboard.service"

type TimeframeType = 'week' | 'month' | 'year'

export function DashboardCharts() {
  const [revenueTimeframe, setRevenueTimeframe] = useState<TimeframeType>("week")
  const [bookingTimeframe, setBookingTimeframe] = useState<TimeframeType>("week")
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([])
  const [bookingsData, setBookingsData] = useState<BookingDataPoint[]>([])
  const [userDistributionData, setUserDistributionData] = useState<UserDistributionDataPoint[]>([])
  const [bookingStatusData, setBookingStatusData] = useState<BookingStatusDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [revenueResponse, bookingsResponse, userDistResponse, bookingStatusResponse] = await Promise.all([
          getRevenueData(revenueTimeframe),
          getBookingData(bookingTimeframe),
          getUserDistributionData("month"),
          getBookingStatusData("month")
        ])

        setRevenueData(revenueResponse?.revenue_data || [])
        setBookingsData(bookingsResponse || [])
        setUserDistributionData(userDistResponse || [])
        setBookingStatusData(bookingStatusResponse || [])
      } catch (error) {
        console.error("Error fetching chart data:", error)
        // Set empty arrays in case of error
        setRevenueData([])
        setBookingsData([])
        setUserDistributionData([])
        setBookingStatusData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [revenueTimeframe, bookingTimeframe])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)

  const pieColors = ["#6366f1", "#f59e0b", "#ef4444"]
  const pieColors2 = ["#10b981", "#3b82f6", "#f43f5e"]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded mt-2" />
            </CardHeader>
            <CardContent className="h-[300px]">
              <div className="h-full w-full bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex justify-between pb-3">
          <div>
            <CardTitle>Doanh thu</CardTitle>
            <CardDescription>Biểu đồ doanh thu theo thời gian</CardDescription>
          </div>
          <Tabs value={revenueTimeframe} onValueChange={(value) => setRevenueTimeframe(value as TimeframeType)}>
            <TabsList className="grid grid-cols-3 h-8 text-xs">
              <TabsTrigger value="week">Tuần</TabsTrigger>
              <TabsTrigger value="month">Tháng</TabsTrigger>
              <TabsTrigger value="year">Năm</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="h-[300px]">
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="Doanh_thu" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Không có dữ liệu
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between pb-3">
          <div>
            <CardTitle>Đặt lịch</CardTitle>
            <CardDescription>Số lượng đặt lịch theo thời gian</CardDescription>
          </div>
          <Tabs value={bookingTimeframe} onValueChange={(value) => setBookingTimeframe(value as TimeframeType)}>
            <TabsList className="grid grid-cols-3 h-8 text-xs">
              <TabsTrigger value="week">Tuần</TabsTrigger>
              <TabsTrigger value="month">Tháng</TabsTrigger>
              <TabsTrigger value="year">Năm</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="h-[300px]">
          {bookingsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={bookingsData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="Dat_lich" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Không có dữ liệu
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phân bố người dùng</CardTitle>
          <CardDescription>Phân bố người dùng theo vai trò</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {userDistributionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Không có dữ liệu
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trạng thái đặt lịch</CardTitle>
          <CardDescription>Phân bố đặt lịch theo trạng thái</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {bookingStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell2-${index}`} fill={pieColors2[index % pieColors2.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Không có dữ liệu
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
