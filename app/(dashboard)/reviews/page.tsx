"use client"

import { useState, useEffect } from "react"
import { Star, Search, Filter, Trash2, RefreshCw, MessageSquare } from "lucide-react"
import { getReviews, deleteReview } from "@/services/review.service"
import type { ReviewResponse, Review } from "@/services/review.service"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

export default function ReviewList() {
  const [reviewData, setReviewData] = useState<ReviewResponse | null>(null)
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [])

  useEffect(() => {
    filterReviews()
  }, [reviewData, searchTerm, ratingFilter])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const data = await getReviews()
      setReviewData(data)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      toast.error("Không thể tải danh sách đánh giá")
    } finally {
      setLoading(false)
    }
  }

  const filterReviews = () => {
    if (!reviewData) return

    let filtered = reviewData.reviews

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by rating
    if (ratingFilter !== "all") {
      filtered = filtered.filter((review) => review.rating === parseInt(ratingFilter))
    }

    setFilteredReviews(filtered)
  }

  const handleDeleteReview = async () => {
    if (!selectedReview) return

    try {
      await deleteReview(selectedReview.review_id)
      toast.success("Xóa đánh giá thành công")
      setDeleteDialogOpen(false)
      fetchReviews()
    } catch (error) {
      console.error("Error deleting review:", error)
      toast.error("Không thể xóa đánh giá")
    }
  }

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 5:
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case 4:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case 3:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case 2:
        return "bg-orange-100 text-orange-800 hover:bg-orange-200"
      case 1:
        return "bg-red-100 text-red-800 hover:bg-red-200"
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

  const calculateAverageRating = () => {
    if (!filteredReviews || filteredReviews.length === 0) return 0
    const total = filteredReviews.reduce((sum, review) => sum + review.rating, 0)
    return (total / filteredReviews.length).toFixed(1)
  }

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
          <h1 className="text-3xl font-bold">Đánh giá</h1>
          <p className="text-muted-foreground">Tổng cộng {filteredReviews.length} đánh giá</p>
        </div>
        <Button variant="outline" onClick={fetchReviews}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đánh giá</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewData?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Tất cả đánh giá</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đánh giá trung bình</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{calculateAverageRating()}</div>
            <p className="text-xs text-muted-foreground">Trên 5 sao</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đánh giá 5 sao</CardTitle>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-500" />
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredReviews.filter((r) => r.rating === 5).length}
            </div>
            <p className="text-xs text-muted-foreground">Đánh giá xuất sắc</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo tên khách hàng hoặc nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Số sao" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả sao</SelectItem>
            {[5, 4, 3, 2, 1].map((rating) => (
              <SelectItem key={rating} value={rating.toString()}>
                {rating} sao
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
                <TableHead>Khách hàng</TableHead>
                <TableHead>Đánh giá</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.review_id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.customer_avatar || undefined} />
                        <AvatarFallback>
                          {review.customer_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{review.customer_name || "Khách hàng"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRatingColor(review.rating)}>
                      {review.rating} sao
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2">{review.comment}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {formatDate(review.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedReview(review)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.review_id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={review.customer_avatar || undefined} />
                    <AvatarFallback>
                      {review.customer_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{review.customer_name || "Khách hàng"}</CardTitle>
                    <Badge className={getRatingColor(review.rating)}>
                      {review.rating} sao
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">{review.comment}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {formatDate(review.created_at)}
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedReview(review)
                  setDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                Xóa đánh giá
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Không tìm thấy đánh giá nào</h3>
            <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa đánh giá</DialogTitle>
          </DialogHeader>
          <p>Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteReview}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
