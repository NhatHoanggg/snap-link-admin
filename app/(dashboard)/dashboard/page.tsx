'use client'

import React, { useEffect, useState } from 'react'
import { AdminService, AdminDashboard } from '@/services/admin.service'
import { getBookingDistribution, BookingDistribution } from '@/services/booking.service'
import { getRequestDistribution, RequestDistribution } from '@/services/request.service'
import { DashboardCards } from '@/components/admin/dashboard/dashboard-cards'
import { DashboardCardsSkeleton } from '@/components/admin/dashboard/dashboard-cards-skeleton'
import { DashboardCharts } from '@/components/admin/dashboard/dashboard-charts'
import { DashboardChartsSkeleton } from '@/components/admin/dashboard/dashboard-charts-skeleton'

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null)
  const [bookingDist, setBookingDist] = useState<BookingDistribution | null>(null)
  const [requestDist, setRequestDist] = useState<RequestDistribution | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [dashboardData, bookingData, requestData] = await Promise.all([
          AdminService.getDashboard(),
          getBookingDistribution(),
          getRequestDistribution(),
        ])
        setDashboard(dashboardData)
        setBookingDist(bookingData)
        setRequestDist(requestData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      {loading || !dashboard ? <DashboardCardsSkeleton /> : (
        <DashboardCards
          totalUsers={dashboard.total_users}
          totalPhotographers={dashboard.total_photographers}
          totalBookings={dashboard.total_bookings}
          totalRevenue={dashboard.total_revenue}
        />
      )}
      {loading || !bookingDist || !requestDist ? <DashboardChartsSkeleton /> : (
        <DashboardCharts bookingDist={bookingDist as unknown as Record<string, number>} requestDist={requestDist as unknown as Record<string, number>} />
      )}
    </div>
  )
}