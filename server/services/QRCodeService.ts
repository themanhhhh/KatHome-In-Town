import { DonDatPhong } from '../entities/DonDatPhong';

/**
 * QR Code Service - đơn giản
 * Chỉ trả về đường dẫn ảnh QR có sẵn trong folder img
 */
export class QRCodeService {
  /**
   * Lấy đường dẫn ảnh QR code thanh toán
   */
  static getPaymentQRCode(): string {
    // Trả về đường dẫn ảnh QR trong folder img
    // Frontend sẽ hiển thị: <img src="/img/qr-payment.png" />
    return '/img/qr-payment.png';
  }

  /**
   * Lấy thông tin chuyển khoản
   */
  static getPaymentInfo(booking: DonDatPhong): {
    nganHang: string;
    soTaiKhoan: string;
    chuTaiKhoan: string;
    soTien: number;
    noiDung: string;
    qrCodeUrl: string;
  } {
    const bankId = process.env.BANK_ID || 'VCB';
    const accountNo = process.env.BANK_ACCOUNT_NO || '1024018878';
    const accountName = process.env.BANK_ACCOUNT_NAME || 'HOTEL BOOKING';

    return {
      nganHang: bankId,
      soTaiKhoan: accountNo,
      chuTaiKhoan: accountName,
      soTien: booking.totalAmount || 0,
      noiDung: `${booking.maDatPhong} ${booking.customerName}`,
      qrCodeUrl: this.getPaymentQRCode(),
    };
  }
}

