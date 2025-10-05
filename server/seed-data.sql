-- ============================================================
-- KATHOME IN TOWN - DỮ LIỆU MẪU
-- ============================================================
-- File này chứa dữ liệu mẫu để test hệ thống
-- Chạy file này sau khi đã run migrations
-- ============================================================

-- ============================================================
-- 1. CƠ SỞ (CoSo)
-- ============================================================
INSERT INTO co_so ("maCoSo", "tenCoSo", "diaChi", "sdt") VALUES
('TCS', 'KatHome - 6 Trịnh Công Sơn', '6 Trịnh Công Sơn, Tây Hồ, Hà Nội', '0988946568'),
('VM', 'KatHome - 274 Vũ Miên', '274 Vũ Miên, Tây Hồ, Hà Nội', '0988946568'),
('YP', 'KatHome - 133B Yên Phụ', '133B Yên Phụ, Tây Hồ, Hà Nội', '0988946568'),
('145AC', 'KatHome - 145 Âu Cơ', '145 Âu Cơ, Tây Hồ, Hà Nội', '0988946568'),
('PHT', 'KatHome - 29 Phạm Hồng Thái', '29 Phạm Hồng Thái, Ba Đình, Hà Nội', '0988946568'),
('7ADT', 'KatHome - 7A Dã Tượng', '7A ngõ Dã Tượng, Hoàn Kiếm, Hà Nội', '0988946568'),
('PL', 'KatHome - 29D Phương Liệt', '29D Phương Liệt, Thanh Xuân, Hà Nội', '0988946568'),
('HC', 'KatHome - Hoàng Cầu', '30 Vườn hoa 1-6, Hoàng Cầu, Đống Đa, Hà Nội', '0988946568'),
('XQ', 'KatHome - 18 Xuân Quỳnh', '18 Xuân Quỳnh, Yên Hòa, Cầu Giấy, Hà Nội', '0988946568');

-- ============================================================
-- 2. HẠNG PHÒNG (HangPhong)
-- ============================================================
INSERT INTO hang_phong ("maHangPhong", "tenHangPhong", "sucChua", "moTa") VALUES
('VIP', 'VIP', 2, 'Phòng VIP cao cấp với đầy đủ tiện nghi, view đẹp'),
('STD', 'Standard', 2, 'Phòng tiêu chuẩn, sạch sẽ, tiện nghi cơ bản'),
('DLX', 'Deluxe', 3, 'Phòng Deluxe rộng rãi, phù hợp gia đình nhỏ'),
('SUITE', 'Suite', 4, 'Phòng Suite sang trọng, có phòng khách riêng'),
('DBL', 'Double', 2, 'Phòng đôi với 1 giường lớn'),
('TWN', 'Twin', 2, 'Phòng đôi với 2 giường đơn');

-- ============================================================
-- 3. PHÒNG (Phong)
-- ============================================================

-- Cơ sở TCS - 6 Trịnh Công Sơn (10 phòng)
INSERT INTO phong ("maPhong", "moTa", "hangPhongMaHangPhong", "coSoMaCoSo") VALUES
('TCS101', 'Phòng tầng 1, view sân vườn', 'VIP', 'TCS'),
('TCS102', 'Phòng tầng 1, view đường', 'STD', 'TCS'),
('TCS201', 'Phòng tầng 2, view hồ Tây', 'VIP', 'TCS'),
('TCS202', 'Phòng tầng 2, view đường', 'DLX', 'TCS'),
('TCS203', 'Phòng tầng 2, view sân vườn', 'STD', 'TCS'),
('TCS301', 'Phòng tầng 3, view toàn cảnh', 'SUITE', 'TCS'),
('TCS302', 'Phòng tầng 3, view hồ Tây', 'VIP', 'TCS'),
('TCS303', 'Phòng tầng 3, view đường', 'DBL', 'TCS'),
('TCS304', 'Phòng tầng 3, view sân vườn', 'TWN', 'TCS'),
('TCS401', 'Penthouse, view 360°', 'SUITE', 'TCS');

-- Cơ sở VM - 274 Vũ Miên (8 phòng)
INSERT INTO phong ("maPhong", "moTa", "hangPhongMaHangPhong", "coSoMaCoSo") VALUES
('VM101', 'Phòng tầng 1, gần sảnh', 'STD', 'VM'),
('VM102', 'Phòng tầng 1, view vườn', 'STD', 'VM'),
('VM201', 'Phòng tầng 2, view hồ', 'VIP', 'VM'),
('VM202', 'Phòng tầng 2, view đường', 'DLX', 'VM'),
('VM203', 'Phòng tầng 2, ban công rộng', 'DBL', 'VM'),
('VM301', 'Phòng tầng 3, view đẹp', 'VIP', 'VM'),
('VM302', 'Phòng tầng 3, phòng đôi', 'TWN', 'VM'),
('VM303', 'Phòng tầng 3, suite', 'SUITE', 'VM');

-- Cơ sở YP - 133B Yên Phụ (6 phòng)
INSERT INTO phong ("maPhong", "moTa", "hangPhongMaHangPhong", "coSoMaCoSo") VALUES
('YP101', 'Phòng tầng 1, view phố', 'STD', 'YP'),
('YP102', 'Phòng tầng 1, yên tĩnh', 'STD', 'YP'),
('YP201', 'Phòng tầng 2, view hồ Tây', 'VIP', 'YP'),
('YP202', 'Phòng tầng 2, deluxe', 'DLX', 'YP'),
('YP301', 'Phòng tầng 3, cao cấp', 'VIP', 'YP'),
('YP302', 'Phòng tầng 3, gia đình', 'SUITE', 'YP');

-- Cơ sở 145AC - 145 Âu Cơ (12 phòng)
INSERT INTO phong ("maPhong", "moTa", "hangPhongMaHangPhong", "coSoMaCoSo") VALUES
('145AC101', 'Phòng tầng 1, tiêu chuẩn', 'STD', '145AC'),
('145AC102', 'Phòng tầng 1, twin', 'TWN', '145AC'),
('145AC103', 'Phòng tầng 1, double', 'DBL', '145AC'),
('145AC201', 'Phòng tầng 2, VIP', 'VIP', '145AC'),
('145AC202', 'Phòng tầng 2, deluxe', 'DLX', '145AC'),
('145AC203', 'Phòng tầng 2, standard', 'STD', '145AC'),
('145AC301', 'Phòng tầng 3, suite', 'SUITE', '145AC'),
('145AC302', 'Phòng tầng 3, VIP view hồ', 'VIP', '145AC'),
('145AC303', 'Phòng tầng 3, deluxe', 'DLX', '145AC'),
('145AC401', 'Phòng tầng 4, penthouse', 'SUITE', '145AC'),
('145AC402', 'Phòng tầng 4, VIP', 'VIP', '145AC'),
('145AC403', 'Phòng tầng 4, twin', 'TWN', '145AC');

-- Cơ sở PHT - 29 Phạm Hồng Thái (5 phòng)
INSERT INTO phong ("maPhong", "moTa", "hangPhongMaHangPhong", "coSoMaCoSo") VALUES
('PHT101', 'Phòng tầng 1, view phố cổ', 'STD', 'PHT'),
('PHT102', 'Phòng tầng 1, yên tĩnh', 'DBL', 'PHT'),
('PHT201', 'Phòng tầng 2, VIP', 'VIP', 'PHT'),
('PHT202', 'Phòng tầng 2, deluxe', 'DLX', 'PHT'),
('PHT301', 'Phòng tầng 3, suite', 'SUITE', 'PHT');

-- Cơ sở 7ADT - 7A Dã Tượng (7 phòng)
INSERT INTO phong ("maPhong", "moTa", "hangPhongMaHangPhong", "coSoMaCoSo") VALUES
('7ADT101', 'Phòng tầng 1, gần hồ Gươm', 'STD', '7ADT'),
('7ADT102', 'Phòng tầng 1, twin', 'TWN', '7ADT'),
('7ADT201', 'Phòng tầng 2, VIP view hồ', 'VIP', '7ADT'),
('7ADT202', 'Phòng tầng 2, double', 'DBL', '7ADT'),
('7ADT203', 'Phòng tầng 2, deluxe', 'DLX', '7ADT'),
('7ADT301', 'Phòng tầng 3, suite', 'SUITE', '7ADT'),
('7ADT302', 'Phòng tầng 3, VIP', 'VIP', '7ADT');

-- Cơ sở PL - 29D Phương Liệt (8 phòng)
INSERT INTO phong ("maPhong", "moTa", "hangPhongMaHangPhong", "coSoMaCoSo") VALUES
('PL101', 'Phòng tầng 1, tiêu chuẩn', 'STD', 'PL'),
('PL102', 'Phòng tầng 1, double', 'DBL', 'PL'),
('PL201', 'Phòng tầng 2, VIP', 'VIP', 'PL'),
('PL202', 'Phòng tầng 2, twin', 'TWN', 'PL'),
('PL203', 'Phòng tầng 2, standard', 'STD', 'PL'),
('PL301', 'Phòng tầng 3, suite', 'SUITE', 'PL'),
('PL302', 'Phòng tầng 3, deluxe', 'DLX', 'PL'),
('PL303', 'Phòng tầng 3, VIP', 'VIP', 'PL');

-- Cơ sở HC - Hoàng Cầu (9 phòng)
INSERT INTO phong ("maPhong", "moTa", "hangPhongMaHangPhong", "coSoMaCoSo") VALUES
('HC101', 'Phòng tầng 1, gần công viên', 'STD', 'HC'),
('HC102', 'Phòng tầng 1, view vườn hoa', 'DBL', 'HC'),
('HC103', 'Phòng tầng 1, twin', 'TWN', 'HC'),
('HC201', 'Phòng tầng 2, VIP', 'VIP', 'HC'),
('HC202', 'Phòng tầng 2, deluxe', 'DLX', 'HC'),
('HC203', 'Phòng tầng 2, standard', 'STD', 'HC'),
('HC301', 'Phòng tầng 3, suite', 'SUITE', 'HC'),
('HC302', 'Phòng tầng 3, VIP view đẹp', 'VIP', 'HC'),
('HC303', 'Phòng tầng 3, deluxe', 'DLX', 'HC');

-- Cơ sở XQ - 18 Xuân Quỳnh (10 phòng)
INSERT INTO phong ("maPhong", "moTa", "hangPhongMaHangPhong", "coSoMaCoSo") VALUES
('XQ101', 'Phòng tầng 1, tiêu chuẩn', 'STD', 'XQ'),
('XQ102', 'Phòng tầng 1, double', 'DBL', 'XQ'),
('XQ103', 'Phòng tầng 1, twin', 'TWN', 'XQ'),
('XQ201', 'Phòng tầng 2, VIP', 'VIP', 'XQ'),
('XQ202', 'Phòng tầng 2, deluxe', 'DLX', 'XQ'),
('XQ203', 'Phòng tầng 2, standard', 'STD', 'XQ'),
('XQ301', 'Phòng tầng 3, suite', 'SUITE', 'XQ'),
('XQ302', 'Phòng tầng 3, VIP', 'VIP', 'XQ'),
('XQ303', 'Phòng tầng 3, deluxe', 'DLX', 'XQ'),
('XQ401', 'Phòng tầng 4, penthouse', 'SUITE', 'XQ');

-- ============================================================
-- TỔNG KẾT:
-- - 9 cơ sở
-- - 6 loại hạng phòng
-- - 75 phòng
-- ============================================================

