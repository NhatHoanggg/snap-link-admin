// DashboardCharts.tsx using Recharts
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

export interface DashboardChartsProps {
  bookingDist: Record<string, number>
  requestDist: Record<string, number>
}

const bookingStatusLabels: Record<string, string> = {
  completed: "Hoàn thành",
  confirmed: "Đã thanh toán",
  pending: "Đang chờ",
  cancelled: "Đã hủy",
  accepted: "Đã xác nhận"
}
const bookingStatusColors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#6366f1"]
const requestStatusLabels: Record<string, string> = {
  open: "Chờ phản hồi",
  matched: "Đã ghép đôi"
}
const requestStatusColors = ["#6366f1", "#f59e0b"]

export function DashboardCharts({ bookingDist, requestDist }: DashboardChartsProps) {
  const bookingData = Object.entries(bookingDist || {}).map(([key, value]) => ({
    name: bookingStatusLabels[key] || key,
    value
  }))
  const requestData = Object.entries(requestDist || {}).map(([key, value]) => ({
    name: requestStatusLabels[key] || key,
    value
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái Booking</CardTitle>
          <CardDescription>Phân bố trạng thái các booking</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={bookingData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {bookingData.map((entry, index) => (
                  <Cell key={`cell-booking-${index}`} fill={bookingStatusColors[index % bookingStatusColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái Request</CardTitle>
          <CardDescription>Phân bố trạng thái các request</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={requestData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {requestData.map((entry, index) => (
                  <Cell key={`cell-request-${index}`} fill={requestStatusColors[index % requestStatusColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}