import { Phong } from '../entities/Phong';

/**
 * Service tính giá theo flowchart:
 * 1. Giá base theo loại phòng
 * 2. Giá theo mùa và sự kiện
 * 3. Phụ phí người thêm
 * 4. Thuế VAT
 * 5. Giảm giá khuyến mãi
 */

interface PriceBreakdown {
  basePrice: number;
  seasonalSurcharge: number;
  guestSurcharge: number;
  vatAmount: number;
  discount: number;
  totalPrice: number;
}

interface PricingParams {
  room: Phong;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  promotionCode?: string;
}

export class PricingService {
  // VAT rate (10% cho khách sạn ở VN)
  private static readonly VAT_RATE = 0.10;

  // Phụ phí mỗi người thêm (sau khi vượt quá sức chứa)
  private static readonly GUEST_SURCHARGE_PER_PERSON = 100000; // 100k VND

  // Phụ phí theo mùa (%)
  private static readonly SEASONAL_RATES = {
    HIGH_SEASON: 0.30,    // Mùa cao điểm: +30%
    PEAK_SEASON: 0.50,    // Mùa cực cao điểm: +50%
    LOW_SEASON: 0.00,     // Mùa thấp điểm: không phụ phí
  };

  /**
   * Tính giá theo flowchart
   */
  static calculatePrice(params: PricingParams): PriceBreakdown {
    const { room, checkIn, checkOut, adults, children, promotionCode } = params;

    // 1. Giá base theo loại phòng và số đêm
    const nights = this.calculateNights(checkIn, checkOut);
    const basePrice = Number(room.donGiaQuaDem) * nights;

    // 2. Giá theo mùa và sự kiện
    const seasonalSurcharge = this.calculateSeasonalSurcharge(basePrice, checkIn, checkOut);

    // 3. Phụ phí người thêm
    const guestSurcharge = this.calculateGuestSurcharge(room, adults, children);

    // Subtotal trước VAT
    const subtotal = basePrice + seasonalSurcharge + guestSurcharge;

    // 4. Thuế VAT
    const vatAmount = subtotal * this.VAT_RATE;

    // 5. Giảm giá khuyến mãi
    const discount = this.calculateDiscount(subtotal, promotionCode);

    // Tổng tiền
    const totalPrice = subtotal + vatAmount - discount;

    return {
      basePrice,
      seasonalSurcharge,
      guestSurcharge,
      vatAmount,
      discount,
      totalPrice: Math.round(totalPrice), // Làm tròn
    };
  }

  /**
   * Tính số đêm
   */
  private static calculateNights(checkIn: Date, checkOut: Date): number {
    const diff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  }

  /**
   * Tính phụ phí theo mùa
   * Mùa cao điểm: Tết (tháng 1-2), Hè (tháng 6-8), Giáng sinh (tháng 12)
   */
  private static calculateSeasonalSurcharge(
    basePrice: number,
    checkIn: Date,
    checkOut: Date
  ): number {
    const checkInMonth = checkIn.getMonth() + 1; // 1-12
    
    // Kiểm tra mùa cao điểm
    let seasonalRate = this.SEASONAL_RATES.LOW_SEASON;

    // Tết (tháng 1-2)
    if (checkInMonth >= 1 && checkInMonth <= 2) {
      seasonalRate = this.SEASONAL_RATES.PEAK_SEASON;
    }
    // Hè (tháng 6-8)
    else if (checkInMonth >= 6 && checkInMonth <= 8) {
      seasonalRate = this.SEASONAL_RATES.HIGH_SEASON;
    }
    // Giáng sinh (tháng 12)
    else if (checkInMonth === 12) {
      seasonalRate = this.SEASONAL_RATES.PEAK_SEASON;
    }

    return Math.round(basePrice * seasonalRate);
  }

  /**
   * Tính phụ phí người thêm
   */
  private static calculateGuestSurcharge(
    room: Phong,
    adults: number,
    children: number
  ): number {
    const totalGuests = adults + children;
    const roomCapacity = room.sucChua || 2;

    if (totalGuests <= roomCapacity) {
      return 0;
    }

    const extraGuests = totalGuests - roomCapacity;
    return extraGuests * this.GUEST_SURCHARGE_PER_PERSON;
  }

  /**
   * Tính giảm giá khuyến mãi
   * TODO: Kết nối với bảng promotions trong database
   */
  private static calculateDiscount(
    subtotal: number,
    promotionCode?: string
  ): number {
    if (!promotionCode) {
      return 0;
    }

    // Hardcoded promotions (TODO: lấy từ DB)
    const promotions: Record<string, { type: 'percent' | 'fixed'; value: number }> = {
      'SUMMER2024': { type: 'percent', value: 0.15 }, // Giảm 15%
      'NEWYEAR': { type: 'percent', value: 0.20 },    // Giảm 20%
      'FLASH100': { type: 'fixed', value: 100000 },   // Giảm 100k
    };

    const promotion = promotions[promotionCode.toUpperCase()];
    if (!promotion) {
      return 0;
    }

    if (promotion.type === 'percent') {
      return Math.round(subtotal * promotion.value);
    } else {
      return promotion.value;
    }
  }

  /**
   * Validate promotion code
   */
  static async validatePromotionCode(code: string): Promise<boolean> {
    // TODO: Check trong database
    const validCodes = ['SUMMER2024', 'NEWYEAR', 'FLASH100'];
    return validCodes.includes(code.toUpperCase());
  }
}

