"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
// import { vi } from "date-fns/locale"
import Image from "next/image";
import { Calendar, Camera, MapPin, MapPinned, Clock, Tag, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getBookingByCode,
  type BookingResponse,
} from "@/services/booking.service";
import {
  photographerService,
  type Photographer,
} from "@/services/photographer.service";
import { userService, type UserProfileResponse } from "@/services/user.service";

type Booking = BookingResponse;

const fetchBookingByCode = async (code: string): Promise<Booking | null> => {
  try {
    const data = await getBookingByCode(code);
    console.log(data);
    return data;
  } catch {
    return null;
  }
};

const getStatusBadgeVariant = (
  status: string
): "destructive" | "secondary" | "default" | "outline" => {
  switch (status) {
    case "completed":
      return "default";
    case "cancelled":
      return "destructive";
    case "pending":
      return "outline";
    default:
      return "secondary";
  }
};

const getPaymentStatusText = (
  bookingStatus: string,
  paymentStatus: string | null
) => {
  if (!paymentStatus) return "Chưa thanh toán";
  if (bookingStatus === "confirmed" && paymentStatus === "deposit_paid") {
    return "Đã thanh toán một phần (20%)";
  }
  if (bookingStatus === "confirmed" && paymentStatus === "fully_paid") {
    return "Đã thanh toán toàn bộ";
  }
  if (bookingStatus === "completed" && paymentStatus === "deposit_paid") {
    return "Đã thanh toán một phần (20%)";
  }
  if (bookingStatus === "completed" && paymentStatus === "fully_paid") {
    return "Đã hoàn thành";
  }
  return "Chưa thanh toán";
};

const translateShootingType = (type: string) => {
  switch (type) {
    case "outdoor":
      return "Ngoài trời";
    case "studio":
      return "Trong studio";
    default:
      return type;
  }
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photographer, setPhotographer] = useState<Photographer | null>(null);
  const [customer, setCustomer] = useState<UserProfileResponse | null>(null);
  const bookingCode =
    typeof params.code === "string"
      ? params.code
      : Array.isArray(params.code)
      ? params.code[0]
      : null;

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingCode) {
        setError("Mã đặt lịch không hợp lệ");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const data = await fetchBookingByCode(bookingCode);
      if (data) {
        setBooking(data);
      } else {
        setError("Không tìm thấy thông tin đặt lịch");
      }
      setLoading(false);
    };
    loadBooking();
  }, [bookingCode]);

  useEffect(() => {
    const fetchPhotographer = async () => {
      if (booking?.photographer_id) {
        try {
          const data = await photographerService.getPhotographerById(
            booking.photographer_id
          );
          setPhotographer(data);
        } catch {}
      }
    };
    fetchPhotographer();
  }, [booking?.photographer_id]);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (booking?.customer_id) {
        try {
          const data = await userService.getUserById(booking.customer_id);
          setCustomer(data);
        } catch {}
      }
    };
    fetchCustomer();
  }, [booking?.customer_id]);

  const getImageUrl = (url: string | null) => {
    if (!url)
      return "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1748164460/23101740_6725295_ru1wsv.jpg";
    return url;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mr-4"
          >
            Quay lại
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video w-full bg-muted rounded-md overflow-hidden">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            Quay lại
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <span>!</span>
          </div>
          <h3 className="text-lg font-medium">
            {error || "Không tìm thấy thông tin đặt lịch"}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mr-4"
        >
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold">Chi tiết đặt lịch</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{booking.concept}</CardTitle>
              <CardDescription className="flex items-center">
                <span className="font-medium mr-2">Mã đặt lịch:</span>
                <span>{booking.booking_code}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video w-full bg-muted rounded-md overflow-hidden">
                <Image
                  width={300}
                  height={100}
                  src={getImageUrl(booking.illustration_url)}
                  alt={booking.concept || "Ảnh minh họa"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Ngày chụp</h3>
                    <p className="text-muted-foreground">
                      {/* {format(parseISO(booking.booking_date), "EEEE, dd/MM/yyyy", { locale: vi })} */}
                      {booking.booking_date}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Nhiếp ảnh gia</h3>
                    {photographer ? (
                      <Link
                        href={`/photographers/${photographer.slug}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {photographer.full_name}
                      </Link>
                    ) : (
                      <p className="text-muted-foreground">
                        Không thể tải thông tin nhiếp ảnh gia
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Khách hàng</h3>
                    <p className="text-muted-foreground">
                      {customer ? customer.full_name : "Đang tải..."}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Tỉnh/Thành phố</h3>
                    <p className="text-muted-foreground">
                      {booking.province || "Chưa có thông tin tỉnh/thành phố"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MapPinned className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Địa điểm</h3>
                    <p className="text-muted-foreground">
                      {booking.custom_location || "Chưa có thông tin địa điểm"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Loại chụp</h3>
                    <p className="text-muted-foreground">
                      {translateShootingType(booking.shooting_type)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="font-medium">💰</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Tổng tiền</h3>
                    <p className="text-muted-foreground">
                      {booking.total_price > 0
                        ? `${booking.total_price.toLocaleString()} VND`
                        : "Liên hệ"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Badge
                      variant={getStatusBadgeVariant(booking.status)}
                      className="text-sm px-3 py-1"
                    >
                      {getPaymentStatusText(
                        booking.status,
                        booking.payment_status
                      )}
                    </Badge>
                  </div>
                  {/* <div>
                    <h3 className="font-medium">Trạng thái</h3>
                    <p className="text-muted-foreground">{booking.status}</p>
                  </div> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="">
          <CardHeader>
            <CardTitle>Thông tin đặt lịch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm">
                  <span className="text-muted-foreground">Ngày tạo:</span>{" "}
                  {format(parseISO(booking.created_at), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Camera className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm">
                  <span className="text-muted-foreground">Nhiếp ảnh gia:</span>{" "}
                  {loading ? (
                    <span className="inline-block h-4 w-24 bg-muted animate-pulse rounded" />
                  ) : photographer ? (
                    <Link
                      href={`/photographers/${photographer.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {photographer.full_name}
                    </Link>
                  ) : (
                    "Không thể tải thông tin"
                  )}
                </p>
              </div>
            </div>
            {/*  */}
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm">
                  <span className="text-muted-foreground">Khách hàng: </span>{" "}
                  {loading ? (
                    <span className="inline-block h-4 w-24 bg-muted animate-pulse rounded" />
                  ) : customer ? (
                    <span
                      className="hover:text-primary transition-colors"
                    >
                      {customer.full_name}
                    </span>
                  ) : (
                    "Không thể tải thông tin"
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm">
                  <span className="text-muted-foreground">Mã đặt lịch:</span>{" "}
                  {booking.booking_code || "Chưa có"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm">
                  <span className="text-muted-foreground">
                    Trạng thái thanh toán:
                  </span>{" "}
                  {getPaymentStatusText(booking.status, booking.payment_status)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
