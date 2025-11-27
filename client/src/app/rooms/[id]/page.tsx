'use client';

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "../../components/header/header";
import { Footer } from "../../components/footer/footer";
import { RoomDetail } from "../../components/roomdetail/RoomDetail";
import { toast } from "sonner";

export default function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = React.useState<string | null>(null);

  React.useEffect(() => {
    params
      .then((p) => {
        if (!p.id || p.id.trim() === '') {
          toast.error('Lỗi: Mã phòng không hợp lệ', {
            description: 'Không tìm thấy mã phòng trong URL. Vui lòng quay lại trang tìm kiếm.',
            duration: 5000,
          });
          return;
        }
        setRoomId(p.id);
      })
      .catch((error) => {
        console.error('Error loading room params:', error);
        const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
        toast.error('Lỗi khi tải trang', {
          description: `Không thể tải thông tin phòng: ${errorMessage}`,
          duration: 5000,
        });
      });
  }, [params]);

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = parseInt(searchParams.get('guests') || '1');

  const searchData = {
    checkIn,
    checkOut,
    guests,
  };

  const handleBackToSearch = () => {
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: guests.toString(),
    });
    router.push(`/search?${params.toString()}`);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleProceedToCheckout = (
    roomData: {
      id: string;
      name: string;
      type: string;
      price: number;
      image: string;
      maxGuests: number;
      beds: number;
      bathrooms: number;
      branchId?: string;
      branchName?: string;
    },
    selectedSearchData: {
      checkIn: string;
      checkOut: string;
      guests: number;
    }
  ) => {
    try {
      // Validate data before proceeding
      if (!roomData || !roomData.id) {
        toast.error('Lỗi: Thiếu thông tin phòng', {
          description: 'Không thể lấy thông tin phòng. Vui lòng thử lại.',
          duration: 4000,
        });
        return;
      }
      
      if (!selectedSearchData.checkIn || !selectedSearchData.checkOut) {
        toast.error('Lỗi: Thiếu thông tin ngày đặt phòng', {
          description: 'Vui lòng chọn ngày nhận phòng và trả phòng.',
          duration: 4000,
        });
        return;
      }
      
      // Lưu dữ liệu phòng và ngày đã chọn sang sessionStorage cho trang thanh toán
      sessionStorage.setItem('checkoutRoomData', JSON.stringify(roomData));
      sessionStorage.setItem('checkoutSearchData', JSON.stringify(selectedSearchData));
      
      router.push('/checkout');
    } catch (error) {
      console.error('Error proceeding to checkout:', error);
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
      const errorDetails = error instanceof Error ? error.stack : String(error);
      
      toast.error('Lỗi khi chuyển đến trang thanh toán', {
        description: errorMessage,
        duration: 5000,
        action: {
          label: 'Chi tiết',
          onClick: () => {
            console.error('Chi tiết lỗi:', errorDetails);
            toast.error('Chi tiết lỗi', {
              description: errorDetails,
              duration: 10000,
            });
          }
        }
      });
    }
  };

  if (!roomId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <RoomDetail 
          roomId={roomId}
          searchData={searchData}
          onBackToSearch={handleBackToSearch}
          onBackToHome={handleBackToHome}
          onProceedToCheckout={handleProceedToCheckout}
        />
      </main>
      <Footer />
    </div>
  );
}

