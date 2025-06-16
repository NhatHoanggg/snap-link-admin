"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Camera, User, Search, Filter, Eye } from "lucide-react"
import { getBookings, type BookingResponse } from "@/services/booking.service"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function BookingList() {
  const [bookings, setBookings] = useState<BookingResponse[]>([])
  const [filteredBookings, setFilteredBookings] = useState<BookingResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchTerm, statusFilter])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await getBookings()
      console.log(data)
      setBookings(data.data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.booking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.province.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const uniqueStatuses = bookings ? [...new Set(bookings.map((booking) => booking.status))] : []

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Danh sách Booking</h1>
          <p className="text-muted-foreground">Tổng cộng {filteredBookings.length} booking</p>
        </div>
        <Button onClick={fetchBookings}>Làm mới</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo mã booking, concept, tỉnh thành..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {uniqueStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Booking</TableHead>
                <TableHead>Concept</TableHead>
                <TableHead>Ngày chụp</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Loại chụp</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.booking_id}>
                  <TableCell className="font-medium">{booking.booking_code}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {booking.illustration_url && (
                        <img
                          src={booking.illustration_url || "/placeholder.svg"}
                          alt="Concept"
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <span className="truncate max-w-32">{booking.concept}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(booking.booking_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate max-w-24">{booking.custom_location || booking.province}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Camera className="h-4 w-4 text-muted-foreground" />
                      {booking.shooting_type}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {formatPrice(booking.total_price)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Chi tiết Booking #{booking.booking_code}</DialogTitle>
                        </DialogHeader>
                        {selectedBooking && <BookingDetail booking={selectedBooking} />}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.booking_id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">#{booking.booking_code}</CardTitle>
                <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {booking.illustration_url && (
                  <img
                    src={booking.illustration_url || "/placeholder.svg"}
                    alt="Concept"
                    className="w-12 h-12 rounded object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{booking.concept}</p>
                  <p className="text-sm text-muted-foreground">{booking.shooting_type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(booking.booking_date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{booking.custom_location || booking.province}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>SL: {booking.quantity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{formatPrice(booking.total_price)}</span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" onClick={() => setSelectedBooking(booking)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Chi tiết Booking #{booking.booking_code}</DialogTitle>
                  </DialogHeader>
                  {selectedBooking && <BookingDetail booking={selectedBooking} />}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Không tìm thấy booking nào</h3>
            <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function BookingDetail({ booking }: { booking: BookingResponse }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Concept Image */}
      {booking.illustration_url && (
        <div className="text-center">
          <img
            src={booking.illustration_url || "/placeholder.svg"}
            alt="Concept illustration"
            className="w-full max-w-md mx-auto rounded-lg object-cover"
          />
        </div>
      )}

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Mã Booking</label>
            <p className="font-medium">{booking.booking_code}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Concept</label>
            <p className="font-medium">{booking.concept}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Loại chụp</label>
            <p className="font-medium">{booking.shooting_type}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Số lượng</label>
            <p className="font-medium">{booking.quantity} người</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
            <div className="mt-1">
              <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Ngày chụp</label>
            <p className="font-medium">{formatDate(booking.booking_date)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Ngày tạo</label>
            <p className="font-medium">{formatDate(booking.created_at)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Tổng tiền</label>
            <p className="font-medium text-lg text-green-600">{formatPrice(booking.total_price)}</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="text-sm font-medium text-muted-foreground">Địa điểm</label>
        <p className="font-medium">
          {booking.custom_location ? (
            <>
              <span>{booking.custom_location}</span>
              <span className="text-muted-foreground"> ({booking.province})</span>
            </>
          ) : (
            booking.province
          )}
        </p>
      </div>

      {/* Discount Code */}
      {booking.discount_code && (
        <div>
          <label className="text-sm font-medium text-muted-foreground">Mã giảm giá</label>
          <p className="font-medium">{booking.discount_code}</p>
        </div>
      )}

      {/* IDs for reference */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <label className="text-muted-foreground">Customer ID</label>
          <p className="font-medium">{booking.customer_id}</p>
        </div>
        <div>
          <label className="text-muted-foreground">Photographer ID</label>
          <p className="font-medium">{booking.photographer_id}</p>
        </div>
        <div>
          <label className="text-muted-foreground">Service ID</label>
          <p className="font-medium">{booking.service_id}</p>
        </div>
        <div>
          <label className="text-muted-foreground">Location ID</label>
          <p className="font-medium">{booking.location_id}</p>
        </div>
      </div>
    </div>
  )
}
