'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/header/header";
import { Footer } from "../components/footer/footer";
import { coSoApi } from "../../lib/api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/card/card";
import {
  MapPin,
  Phone,
  Building2,
  Bed,
  ChevronRight
} from "lucide-react";

interface CoSo {
  maCoSo: string;
  tenCoSo: string;
  diaChi: string;
  sdt: string;
  phong?: Array<{
    maPhong: string;
  }>;
}

export default function BranchesPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<CoSo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        const data = await coSoApi.getAll();
        setBranches(data as CoSo[]);
      } catch (err) {
        console.error("Error fetching branches:", err);
        setError("Không thể tải danh sách cơ sở. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleBack = () => {
    router.push('/');
  };

  const handleViewDetails = (maCoSo: string) => {
    router.push(`/branches/${maCoSo}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fef5f6' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#3D0301' }}></div>
                <p style={{ color: '#3D0301' }}>Đang tải danh sách cơ sở...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1" style={{ backgroundColor: '#fef5f6' }}>
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Intro Section */}
          <Card className="border-0 shadow-lg mb-8" style={{ backgroundColor: '#FAD0C4' }}>
            <CardContent className="py-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-3" style={{ color: '#3D0301' }}>
                  🏠 KatHome In Town - Hệ thống cơ sở
                </h2>
                <p className="text-lg mb-2" style={{ color: 'rgba(61, 3, 1, 0.8)' }}>
                  Với {branches.length} cơ sở trên khắp Hà Nội
                </p>
                <p className="text-sm" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                  Tổng cộng {branches.reduce((sum, b) => sum + (b.phong?.length || 0), 0)} phòng sẵn sàng phục vụ
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="border-0 shadow-md mb-6 bg-red-50">
              <CardContent className="py-4">
                <p className="text-red-600 text-center">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Branches Grid */}
          {branches.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {branches.map((branch) => (
                <Card 
                  key={branch.maCoSo} 
                  className="border-0 shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleViewDetails(branch.maCoSo)}
                >
                  <CardHeader style={{ backgroundColor: '#fef5f6' }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2" style={{ color: '#3D0301' }}>
                          {branch.tenCoSo}
                        </CardTitle>
                        <div className="flex items-center space-x-2 text-sm" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                          <Building2 className="w-4 h-4" />
                          <span>Mã: {branch.maCoSo}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: '#3D0301' }} />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    {/* Address */}
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#3D0301' }} />
                      <p className="text-sm flex-1" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                        {branch.diaChi}
                      </p>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#3D0301' }} />
                      <a 
                        href={`tel:${branch.sdt}`}
                        className="text-sm hover:underline"
                        style={{ color: '#3D0301' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {branch.sdt}
                      </a>
                    </div>

                    {/* Room Count */}
                    <div className="pt-3 mt-3 border-t" style={{ borderColor: '#FAD0C4' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bed className="w-4 h-4" style={{ color: '#3D0301' }} />
                          <span className="text-sm" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                            Số phòng:
                          </span>
                        </div>
                        <span className="font-semibold text-lg" style={{ color: '#3D0301' }}>
                          {branch.phong?.length || 0}
                        </span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Button
                      className="w-full mt-4 text-white"
                      style={{ backgroundColor: '#3D0301' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(branch.maCoSo);
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            !error && (
              <Card className="border-0 shadow-md">
                <CardContent className="py-12 text-center">
                  <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: '#3D0301' }} />
                  <p style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                    Chưa có cơ sở nào được đăng ký.
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}

