"use client";

import React, { useState } from "react";
import Image from "next/image";
import * as XLSX from 'xlsx';
import { 
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  Building,
  RefreshCw,
  AlertCircle
} from "lucide-react";

import Style from "../../styles/cosomanagement.module.css";
import { useApi } from "../../../hooks/useApi";
import { cosoApi } from "../../../lib/api";
import { ApiCoSo } from "../../../types/api";
import LoadingSpinner from "../../components/loading-spinner";
import { CoSoForm } from "../../components/coso-form";
import { toast } from "sonner";

const CoSoManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCoSos, setSelectedCoSos] = useState<string[]>([]);
  const [showCoSoForm, setShowCoSoForm] = useState(false);
  const [editingCoSo, setEditingCoSo] = useState<ApiCoSo | null>(null);

  // Fetch data from API
  const { data: cosos = [], loading: cososLoading, error: cososError, refetch: refetchCoSos } = useApi<ApiCoSo[]>(
    () => cosoApi.getAll(),
    []
  );

  // Filter functions
  const filteredCoSos = (cosos || []).filter(coso => {
    const matchesSearch = coso.tenCoSo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (coso.diaChi || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (coso.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (coso.soDienThoai || '').includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || 
                         (coso.trangThai || 'active') === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Selection functions
  const handleSelectAll = () => {
    if (selectedCoSos.length === filteredCoSos.length) {
      setSelectedCoSos([]);
    } else {
      setSelectedCoSos(filteredCoSos.map(coso => coso.maCoSo));
    }
  };

  const handleSelectCoSo = (cosoId: string) => {
    setSelectedCoSos(prev =>
      prev.includes(cosoId)
        ? prev.filter(id => id !== cosoId)
        : [...prev, cosoId]
    );
  };

  const handleCreateCoSo = () => {
    setEditingCoSo(null);
    setShowCoSoForm(true);
  };

  const handleEditCoSo = (coso: ApiCoSo) => {
    setEditingCoSo(coso);
    setShowCoSoForm(true);
  };

  const handleDeleteCoSo = async (cosoId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cơ sở này?')) {
      try {
        await cosoApi.delete(cosoId);
        await refetchCoSos();
      } catch (error) {
        console.error('Error deleting coso:', error);
        alert('Có lỗi xảy ra khi xóa cơ sở');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCoSos.length === 0) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedCoSos.length} cơ sở đã chọn?`)) {
      try {
        await Promise.all(selectedCoSos.map(id => cosoApi.delete(id)));
        await refetchCoSos();
        setSelectedCoSos([]);
      } catch (error) {
        console.error('Error deleting cosos:', error);
        alert('Có lỗi xảy ra khi xóa cơ sở');
      }
    }
  };

  const handleFormSuccess = () => {
    refetchCoSos();
    setShowCoSoForm(false);
    setEditingCoSo(null);
  };

  // Utility functions
  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  const handleExportExcel = () => {
    try {
      const getStatusLabel = (status: string) => {
        switch (status) {
          case 'active': return 'Hoạt động';
          case 'inactive': return 'Tạm dừng';
          case 'maintenance': return 'Bảo trì';
          default: return status;
        }
      };

      const exportData = filteredCoSos.map(coso => ({
        'Mã cơ sở': coso.maCoSo,
        'Tên cơ sở': coso.tenCoSo,
        'Địa chỉ': coso.diaChi || 'N/A',
        'Số điện thoại': coso.soDienThoai || 'N/A',
        'Email': coso.email || 'N/A',
        'Trạng thái': getStatusLabel(coso.trangThai || 'active'),
        'Mô tả': coso.moTa || 'N/A',
        'Hình ảnh': coso.hinhAnh || 'N/A'
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách cơ sở');

      const filename = `DanhSachCoSo_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, filename);

      toast.success('Xuất Excel thành công!', {
        description: `File ${filename} đã được tải xuống.`,
        duration: 4000,
      });
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Lỗi xuất Excel', {
        description: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        duration: 5000,
      });
    }
  };

  // Loading and error states
  if (cososLoading) {
    return <LoadingSpinner text="Đang tải ..." />;
  }

  if (cososError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{cososError}</p>
          <button
            onClick={() => refetchCoSos()}
            className={Style.retryButton}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={Style.cosomanagement}>
      {/* Header */}
      <div className={Style.header}>
        <div className={Style.headerContent}>
          <div className={Style.headerInfo}>
            <h1>Quản lý cơ sở</h1>
            <p>
              Quản lý tất cả cơ sở của KatHome In Town
            </p>
          </div>
          
          <div className={Style.headerActions}>
            <button className={Style.exportButton} onClick={handleExportExcel}>
              <Download className="w-4 h-4" />
              <span>Xuất Excel</span>
            </button>
            <button className={Style.addButton} onClick={handleCreateCoSo}>
              <Plus className="w-4 h-4" />
              <span>Thêm cơ sở</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={Style.filtersCard}>
        <div className={Style.filtersContent}>
          <div className={Style.filtersRow}>
            <div className={Style.searchContainer}>
              <Search className={Style.searchIcon} />
              <input
                type="text"
                placeholder="Tìm kiếm cơ sở..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={Style.searchInput}
              />
            </div>
            
            <div className={Style.filterControls}>
              <div className={Style.filterGroup}>
                <Filter className={Style.filterIcon} />
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={Style.selectTrigger}
                >
                  <option value="all">Tất cả</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm dừng</option>
                  <option value="maintenance">Bảo trì</option>
                </select>
              </div>
              
              <button 
                className={Style.refreshButton}
                onClick={() => refetchCoSos()}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={Style.statsGrid}>
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {filteredCoSos.length}
            </div>
            <div className={Style.statLabel}>
              Tổng cơ sở
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {(cosos || []).filter(c => c.hinhAnh).length}
            </div>
            <div className={Style.statLabel}>
              Có hình ảnh
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {(cosos || []).filter(c => c.email).length}
            </div>
            <div className={Style.statLabel}>
              Có email
            </div>
          </div>
        </div>
        
        <div className={Style.statCard}>
          <div className={Style.statContent}>
            <div className={Style.statValue}>
              {(cosos || []).filter(c => c.soDienThoai).length}
            </div>
            <div className={Style.statLabel}>
              Có số điện thoại
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={Style.tableCard}>
        <div className={Style.tableHeader}>
          <div className={Style.tableHeaderContent}>
            <h3 className={Style.tableTitle}>
              Danh sách cơ sở ({filteredCoSos.length})
            </h3>
            {selectedCoSos.length > 0 && (
              <div className={Style.bulkActions}>
                <span className={Style.bulkText}>
                  Đã chọn {selectedCoSos.length} cơ sở
                </span>
                <button 
                  className={`${Style.bulkButton} ${Style.bulkButtonDanger}`}
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa đã chọn
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={Style.tableContent}>
          <div className={Style.tableContainer}>
            <table className={Style.table}>
              <thead>
                <tr>
                  <th className={Style.tableHeadCell}>
                    <input
                      type="checkbox"
                      checked={selectedCoSos.length === filteredCoSos.length && filteredCoSos.length > 0}
                      onChange={handleSelectAll}
                      className={Style.checkbox}
                    />
                  </th>
                  <th className={Style.tableHeadCell}>Cơ sở</th>
                  <th className={Style.tableHeadCell}>Địa chỉ</th>
                  <th className={Style.tableHeadCell}>Liên hệ</th>
                  <th className={Style.tableHeadCell}>Trạng thái</th>
                  <th className={Style.tableHeadCell}>Mô tả</th>
                  <th className={Style.tableHeadCell}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoSos.map((coso, index) => (
                  <tr key={coso.maCoSo || `coso-${index}`} className={Style.tableRow}>
                    <td className={Style.tableCell}>
                      <input
                        type="checkbox"
                        checked={selectedCoSos.includes(coso.maCoSo)}
                        onChange={() => handleSelectCoSo(coso.maCoSo)}
                        className={Style.checkbox}
                      />
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.cosInfo}>
                        <div className={Style.cosHeader}>
                          <h4 className={Style.cosName}>{coso.tenCoSo}</h4>
                          {coso.hinhAnh && (
                            <div className={Style.cosImage}>
                              <Image 
                                src={coso.hinhAnh} 
                                alt={coso.tenCoSo}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.locationInfo}>
                        <MapPin className={Style.locationIcon} />
                        <span className={Style.locationText}>{coso.diaChi || 'N/A'}</span>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.contactInfo}>
                        {coso.soDienThoai && (
                          <div className={Style.contactItem}>
                            <Phone className={Style.contactIcon} />
                            <span className={Style.contactText}>
                              {formatPhone(coso.soDienThoai)}
                            </span>
                          </div>
                        )}
                        {coso.email && (
                          <div className={Style.contactItem}>
                            <Mail className={Style.contactIcon} />
                            <span className={Style.contactText}>{coso.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.statusInfo}>
                        {coso.trangThai === 'active' && (
                          <span className={`${Style.statusBadge} ${Style.statusActive}`}>
                            Hoạt động
                          </span>
                        )}
                        {coso.trangThai === 'inactive' && (
                          <span className={`${Style.statusBadge} ${Style.statusInactive}`}>
                            Tạm dừng
                          </span>
                        )}
                        {coso.trangThai === 'maintenance' && (
                          <span className={`${Style.statusBadge} ${Style.statusMaintenance}`}>
                            Bảo trì
                          </span>
                        )}
                        {!coso.trangThai && (
                          <span className={`${Style.statusBadge} ${Style.statusActive}`}>
                            Hoạt động
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.descriptionInfo}>
                        <span className={Style.descriptionText}>
                          {coso.moTa || 'Chưa có mô tả'}
                        </span>
                      </div>
                    </td>
                    <td className={Style.tableCell}>
                      <div className={Style.actions}>
                        <button className={Style.actionButton}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className={Style.actionButton}
                          onClick={() => handleEditCoSo(coso)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className={`${Style.actionButton} ${Style.actionButtonDanger}`}
                          onClick={() => handleDeleteCoSo(coso.maCoSo)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredCoSos.length === 0 && (
              <div className={Style.emptyState}>
                <Building className={Style.emptyIcon} />
                <p>Không tìm thấy cơ sở nào</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CoSo Form Modal */}
      {showCoSoForm && (
        <CoSoForm
          coso={editingCoSo}
          onClose={() => {
            setShowCoSoForm(false);
            setEditingCoSo(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default CoSoManagementPage;
