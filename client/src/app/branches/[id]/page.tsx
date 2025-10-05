'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "../../components/header/header";
import { Footer } from "../../components/footer/footer";
import { coSoApi } from "../../../lib/api";
import { BranchDetail } from "../../components/branchdetail/BranchDetail";

interface CoSo {
  maCoSo: string;
  tenCoSo: string;
  diaChi: string;
  sdt: string;
  phong?: Array<{
    maPhong: string;
    hangPhong: {
      maHangPhong: string;
      tenHangPhong: string;
      sucChua: number;
      moTa: string;
    };
  }>;
}

export default function BranchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [coSo, setCoSo] = useState<CoSo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBranchDetail = async () => {
      try {
        setIsLoading(true);
        const id = params.id as string;
        const data = await coSoApi.getById(id);
        setCoSo(data);
      } catch (err) {
        console.error("Error fetching branch:", err);
        setError("Không thể tải thông tin cơ sở. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchBranchDetail();
    }
  }, [params.id]);

  const handleBack = () => {
    router.push('/branches');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#3D0301' }}></div>
            <p style={{ color: '#3D0301' }}>Đang tải thông tin cơ sở...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !coSo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Không tìm thấy cơ sở"}</p>
            <button
              onClick={handleBack}
              className="px-6 py-2 text-white rounded-lg"
              style={{ backgroundColor: '#3D0301' }}
            >
              Quay lại danh sách
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <BranchDetail coSo={coSo} onBack={handleBack} />
      </main>
      <Footer />
    </div>
  );
}

