"use client"

import { useState, useEffect } from "react"
import { Calendar, CreditCard, Search, Filter, Eye, Download, RefreshCw, DollarSign } from "lucide-react"
import { getPaymentHistory } from "@/services/payment.service"
import type { PaymentHistoryResponse, Payment } from "@/services/payment.service"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

export default function PaymentHistory() {
  const [paymentData, setPaymentData] = useState<PaymentHistoryResponse | null>(null)
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  useEffect(() => {
    fetchPaymentHistory()
  }, [])

  useEffect(() => {
    filterPayments()
  }, [paymentData, searchTerm, statusFilter, typeFilter])

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true)
      const data = await getPaymentHistory()
      setPaymentData(data)
    } catch (error) {
      console.error("Error fetching payment history:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterPayments = () => {
    if (!paymentData) return

    let filtered = paymentData.payments

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.booking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.order_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.payment_id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter)
    }

    // Filter by payment type
    if (typeFilter !== "all") {
      filtered = filtered.filter((payment) => payment.payment_type === typeFilter)
    }

    setFilteredPayments(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "FAILED":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    }
  }

  const getPaymentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "full":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "deposit":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getPaymentTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case "full":
        return "Thanh toán đủ"
      case "deposit":
        return "Đặt cọc"
      default:
        return type
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const calculateTotalAmount = () => {
    if (!filteredPayments || filteredPayments.length === 0) return 0;
    
    return filteredPayments
      .filter((payment) => payment.status.toUpperCase() === "PAID")
      .reduce((total, payment) => {
        const amount = Number(payment.amount) || 0;
        return total + amount;
      }, 0);
  }

  const uniqueStatuses = paymentData ? [...new Set(paymentData.payments.map((payment) => payment.status))] : []
  const uniqueTypes = paymentData ? [...new Set(paymentData.payments.map((payment) => payment.payment_type))] : []

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-10 w-40" />
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
          <h1 className="text-3xl font-bold">Lịch sử thanh toán</h1>
          <p className="text-muted-foreground">Tổng cộng {filteredPayments.length} giao dịch</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchPaymentHistory}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng giao dịch</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentData?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Tất cả giao dịch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã thanh toán</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatPrice(calculateTotalAmount())}</div>
            <p className="text-xs text-muted-foreground">Tổng số tiền đã thu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Giao dịch thành công</CardTitle>
            <Badge className="bg-green-100 text-green-800">
              {filteredPayments.filter((p) => p.status.toUpperCase() === "PAID").length}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (filteredPayments.filter((p) => p.status.toUpperCase() === "PAID").length /
                  (filteredPayments.length || 1)) *
                  100,
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">Tỷ lệ thành công</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo mã booking, order code, payment ID..."
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
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {uniqueStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <CreditCard className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Loại thanh toán" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            {uniqueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {getPaymentTypeLabel(type)}
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
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Loại thanh toán</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.payment_id}>
                  <TableCell className="font-medium">{payment.booking_code}</TableCell>
                  <TableCell>{payment.order_code}</TableCell>
                  <TableCell className="font-medium text-green-600">{formatPrice(payment.amount)}</TableCell>
                  <TableCell>
                    <Badge className={getPaymentTypeColor(payment.payment_type)}>
                      {getPaymentTypeLabel(payment.payment_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(payment.paid_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedPayment(payment)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Chi tiết thanh toán</DialogTitle>
                        </DialogHeader>
                        {selectedPayment && <PaymentDetail payment={selectedPayment} />}
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
        {filteredPayments.map((payment) => (
          <Card key={payment.payment_id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">#{payment.booking_code}</CardTitle>
                  <p className="text-sm text-muted-foreground">Order: {payment.order_code}</p>
                </div>
                <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">{formatPrice(payment.amount)}</span>
                <Badge className={getPaymentTypeColor(payment.payment_type)}>
                  {getPaymentTypeLabel(payment.payment_type)}
                </Badge>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(payment.paid_at)}</span>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" onClick={() => setSelectedPayment(payment)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Chi tiết thanh toán</DialogTitle>
                  </DialogHeader>
                  {selectedPayment && <PaymentDetail payment={selectedPayment} />}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPayments.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Không tìm thấy giao dịch nào</h3>
            <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function PaymentDetail({ payment }: { payment: Payment }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "FAILED":
        return "bg-red-100 text-red-800"
      case "CANCELLED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getPaymentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "full":
        return "bg-blue-100 text-blue-800"
      case "deposit":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case "full":
        return "Thanh toán đủ"
      case "deposit":
        return "Đặt cọc"
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      {/* Payment Amount */}
      <div className="text-center">
        <div className="text-4xl font-bold text-green-600 mb-2">{formatPrice(payment.amount)}</div>
        <Badge className={`${getPaymentTypeColor(payment.payment_type)} text-sm`}>
          {getPaymentTypeLabel(payment.payment_type)}
        </Badge>
      </div>

      <Separator />

      {/* Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Mã Booking</label>
            <p className="font-medium text-lg">{payment.booking_code}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Mã đơn hàng</label>
            <p className="font-medium">{payment.order_code}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
            <div className="mt-1">
              <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Payment ID</label>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">{payment.payment_id}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">User ID</label>
            <p className="font-medium">{payment.user_id}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Thời gian thanh toán</label>
            <p className="font-medium">{formatDate(payment.paid_at)}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Tải hóa đơn
        </Button>
        <Button variant="outline">
          <CreditCard className="h-4 w-4 mr-2" />
          Xem booking
        </Button>
      </div>
    </div>
  )
}
