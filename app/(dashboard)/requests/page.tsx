"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Camera, User, Search, Filter, Eye } from "lucide-react"
import { getRequests, type RequestResponse } from "@/services/request.service"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function RequestList() {
  const [requests, setRequests] = useState<RequestResponse[]>([])
  const [filteredRequests, setFilteredRequests] = useState<RequestResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<RequestResponse | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  useEffect(() => {
    filterRequests()
  }, [requests, searchTerm, statusFilter])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const data = await getRequests()
      console.log(data)
      setRequests(data.data)
      setFilteredRequests(data.data)
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterRequests = () => {
    let filtered = requests

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.request_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.province.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    setFilteredRequests(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "accepted":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "rejected":
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

  const uniqueStatuses = requests ? [...new Set(requests.map((request) => request.status))] : []

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
          <h1 className="text-3xl font-bold">Danh sách Yêu cầu</h1>
          <p className="text-muted-foreground">Tổng cộng {filteredRequests.length} yêu cầu</p>
        </div>
        <Button onClick={fetchRequests}>Làm mới</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo mã yêu cầu, concept, tỉnh thành..."
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
                <TableHead>Mã Yêu cầu</TableHead>
                <TableHead>Concept</TableHead>
                <TableHead>Ngày chụp</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Loại chụp</TableHead>
                <TableHead>Ngân sách</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.request_id}>
                  <TableCell className="font-medium">{request.request_code}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {request.illustration_url && (
                        <img
                          src={request.illustration_url || "/placeholder.svg"}
                          alt="Concept"
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <span className="truncate max-w-32">{request.concept}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(request.request_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate max-w-24">{request.location_text || request.province}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Camera className="h-4 w-4 text-muted-foreground" />
                      {request.shooting_type}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {formatPrice(request.estimated_budget)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Chi tiết Yêu cầu #{request.request_code}</DialogTitle>
                        </DialogHeader>
                        {selectedRequest && <RequestDetail request={selectedRequest} />}
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
        {filteredRequests.map((request) => (
          <Card key={request.request_id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">#{request.request_code}</CardTitle>
                <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {request.illustration_url && (
                  <img
                    src={request.illustration_url || "/placeholder.svg"}
                    alt="Concept"
                    className="w-12 h-12 rounded object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{request.concept}</p>
                  <p className="text-sm text-muted-foreground">{request.shooting_type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(request.request_date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{request.location_text || request.province}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Ngân sách: {formatPrice(request.estimated_budget)}</span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" onClick={() => setSelectedRequest(request)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Chi tiết Yêu cầu #{request.request_code}</DialogTitle>
                  </DialogHeader>
                  {selectedRequest && <RequestDetail request={selectedRequest} />}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Không tìm thấy yêu cầu nào</h3>
            <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function RequestDetail({ request }: { request: RequestResponse }) {
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
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
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
      {request.illustration_url && (
        <div className="text-center">
          <img
            src={request.illustration_url || "/placeholder.svg"}
            alt="Concept illustration"
            className="w-full max-w-md mx-auto rounded-lg object-cover"
          />
        </div>
      )}

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Mã Yêu cầu</label>
            <p className="font-medium">{request.request_code}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Concept</label>
            <p className="font-medium">{request.concept}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Loại chụp</label>
            <p className="font-medium">{request.shooting_type}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
            <div className="mt-1">
              <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Ngày chụp</label>
            <p className="font-medium">{formatDate(request.request_date)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Ngày tạo</label>
            <p className="font-medium">{formatDate(request.created_at)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Ngân sách</label>
            <p className="font-medium text-lg text-green-600">{formatPrice(request.estimated_budget)}</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="text-sm font-medium text-muted-foreground">Địa điểm</label>
        <p className="font-medium">
          {request.location_text ? (
            <>
              <span>{request.location_text}</span>
              <span className="text-muted-foreground"> ({request.province})</span>
            </>
          ) : (
            request.province
          )}
        </p>
      </div>

      {/* Offers */}
      {request.offers && request.offers.length > 0 && (
        <div>
          <label className="text-sm font-medium text-muted-foreground">Danh sách đề xuất</label>
          <div className="mt-2 space-y-4">
            {request.offers.map((offer) => (
              <Card key={offer.request_offer_id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Photographer ID</p>
                      <p className="font-medium">{offer.photographer_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Giá đề xuất</p>
                      <p className="font-medium text-green-600">{formatPrice(offer.custom_price)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Trạng thái</p>
                      <Badge className={getStatusColor(offer.status)}>{offer.status}</Badge>
                    </div>
                    {offer.message && (
                      <div>
                        <p className="text-sm text-muted-foreground">Lời nhắn</p>
                        <p className="font-medium">{offer.message}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* IDs for reference */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <label className="text-muted-foreground">User ID</label>
          <p className="font-medium">{request.user_id}</p>
        </div>
        <div>
          <label className="text-muted-foreground">Request ID</label>
          <p className="font-medium">{request.request_id}</p>
        </div>
      </div>
    </div>
  )
}