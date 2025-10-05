'use client';

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../card/card";
import {
  MapPin,
  Phone,
  Home,
  Users,
  Bed
} from "lucide-react";

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

interface BranchDetailProps {
  coSo: CoSo;
  onBack: () => void;
}

export function BranchDetail({ coSo }: BranchDetailProps) {
  // Group rooms by room type
  const roomsByType = coSo.phong?.reduce((acc, phong) => {
    const typeName = phong.hangPhong.tenHangPhong;
    if (!acc[typeName]) {
      acc[typeName] = {
        info: phong.hangPhong,
        rooms: []
      };
    }
    acc[typeName].rooms.push(phong);
    return acc;
  }, {} as Record<string, { info: { maHangPhong: string; tenHangPhong: string; sucChua: number; moTa: string; }, rooms: Array<{ maPhong: string; hangPhong: { maHangPhong: string; tenHangPhong: string; sucChua: number; moTa: string; }; }> }>);

  return (
    <div style={{ backgroundColor: '#fef5f6' }}>
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Branch Info Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader style={{ backgroundColor: '#FAD0C4' }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2" style={{ color: '#3D0301' }}>
                    {coSo.tenCoSo}
                  </CardTitle>
                  <div className="flex items-center space-x-2 text-sm" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                    <Home className="w-4 h-4" />
                    <span>Mã cơ sở: {coSo.maCoSo}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Address */}
                <div className="flex items-start space-x-3 p-4 rounded-lg" style={{ backgroundColor: '#fef5f6' }}>
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#3D0301' }} />
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: '#3D0301' }}>Địa chỉ</p>
                    <p className="text-sm" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>{coSo.diaChi}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-3 p-4 rounded-lg" style={{ backgroundColor: '#fef5f6' }}>
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#3D0301' }} />
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: '#3D0301' }}>Số điện thoại</p>
                    <a 
                      href={`tel:${coSo.sdt}`}
                      className="text-sm hover:underline"
                      style={{ color: '#3D0301' }}
                    >
                      {coSo.sdt}
                    </a>
                  </div>
                </div>
              </div>

              {/* Total Rooms */}
              <div className="mt-4 p-4 rounded-lg border-2 border-dashed text-center" style={{ borderColor: '#FAD0C4' }}>
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Bed className="w-5 h-5" style={{ color: '#3D0301' }} />
                  <p className="text-lg font-semibold" style={{ color: '#3D0301' }}>
                    Tổng số phòng: {coSo.phong?.length || 0}
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                  {Object.keys(roomsByType || {}).length} loại phòng khác nhau
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rooms by Type */}
          {roomsByType && Object.keys(roomsByType).length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold font-heading" style={{ color: '#3D0301' }}>
                Danh sách phòng theo loại
              </h2>
              
              {Object.entries(roomsByType).map(([typeName, { info, rooms }]) => (
                <Card key={typeName} className="border-0 shadow-md">
                  <CardHeader style={{ backgroundColor: '#fef5f6' }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg" style={{ color: '#3D0301' }}>
                          {typeName}
                        </CardTitle>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center space-x-2 text-sm" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                            <Users className="w-4 h-4" />
                            <span>Sức chứa: {info.sucChua} người</span>
                          </div>
                          {info.moTa && (
                            <p className="text-sm" style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                              {info.moTa}
                            </p>
                          )}
                        </div>
                      </div>
                       <div className="ml-4 px-4 py-2 rounded-full" style={{ backgroundColor: '#3D0301' }}>
                         <span className="text-white font-semibold">{rooms?.length || 0} phòng</span>
                       </div>
                    </div>
                  </CardHeader>
                   <CardContent className="pt-4">
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                       {rooms?.map((room) => (
                         <div
                           key={room.maPhong}
                           className="p-3 rounded-lg text-center transition-all hover:shadow-md"
                           style={{ backgroundColor: '#FAD0C4', color: '#3D0301' }}
                         >
                           <div className="flex items-center justify-center space-x-1 mb-1">
                             <Bed className="w-4 h-4" />
                             <span className="font-medium">{room.maPhong}</span>
                           </div>
                           <span className="text-xs opacity-80">Mã phòng</span>
                         </div>
                       ))}
                     </div>
                   </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Rooms Message */}
          {(!coSo.phong || coSo.phong.length === 0) && (
            <Card className="border-0 shadow-md">
              <CardContent className="py-12 text-center">
                <Bed className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: '#3D0301' }} />
                <p style={{ color: 'rgba(61, 3, 1, 0.7)' }}>
                  Cơ sở này chưa có phòng nào được đăng ký.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

