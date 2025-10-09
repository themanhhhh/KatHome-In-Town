import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedSampleData1759700000000 implements MigrationInterface {
  name = 'SeedSampleData1759700000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert CoSo
    await queryRunner.query(`
      INSERT INTO co_so ("maCoSo", "tenCoSo", "diaChi", "sdt") VALUES
      ('TCS', 'KatHome - 6 Trịnh Công Sơn', '6 Trịnh Công Sơn, Tây Hồ, Hà Nội', '0988946568')
      ON CONFLICT ("maCoSo") DO NOTHING;
    `);

    // Insert HangPhong
    await queryRunner.query(`
      INSERT INTO hang_phong ("maHangPhong", "tenHangPhong", "sucChua", "moTa") VALUES
      ('VIP', 'VIP', 2, 'Phòng VIP cao cấp với đầy đủ tiện nghi, view đẹp'),
      ('STD', 'Standard', 2, 'Phòng tiêu chuẩn, sạch sẽ, tiện nghi cơ bản')
      ON CONFLICT ("maHangPhong") DO NOTHING;
    `);

    // Insert a few Phong
    await queryRunner.query(`
      INSERT INTO phong ("maPhong", "moTa", "hangPhongMaHangPhong", "coSoMaCoSo") VALUES
      ('TCS101', 'Phòng tầng 1, view sân vườn', 'VIP', 'TCS'),
      ('TCS102', 'Phòng tầng 1, view đường', 'STD', 'TCS')
      ON CONFLICT ("maPhong") DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM phong WHERE "maPhong" IN ('TCS101','TCS102');`);
    await queryRunner.query(`DELETE FROM hang_phong WHERE "maHangPhong" IN ('VIP','STD');`);
    await queryRunner.query(`DELETE FROM co_so WHERE "maCoSo" = 'TCS';`);
  }
}


