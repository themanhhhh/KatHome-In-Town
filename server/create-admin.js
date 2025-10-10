const { execSync } = require('child_process');

// Chạy TypeScript file
try {
  console.log('🚀 Creating admin user...');
  execSync('npx ts-node -e "import { AppDataSource } from \'./data/datasource\'; import { User } from \'./entities/User\'; import bcrypt from \'bcryptjs\'; (async () => { await AppDataSource.initialize(); const userRepository = AppDataSource.getRepository(User); const existingAdmin = await userRepository.findOne({ where: { taiKhoan: \'admin\' } }); if (existingAdmin) { console.log(\'⚠️  Admin user already exists!\'); console.log(\'📧 Email:\', existingAdmin.gmail); console.log(\'🔑 Password: admin123\'); console.log(\'✅ Email Verified:\', existingAdmin.isEmailVerified); console.log(\'👑 Role:\', existingAdmin.vaiTro); if (!existingAdmin.isEmailVerified) { existingAdmin.isEmailVerified = true; await userRepository.save(existingAdmin); console.log(\'✅ Updated admin email verification status\'); } return; } const hashedPassword = await bcrypt.hash(\'admin123\', 10); const adminUser = userRepository.create({ taiKhoan: \'admin\', matKhau: hashedPassword, gmail: \'admin@booking.com\', vaiTro: \'admin\', soDienThoai: \'0123456789\', isEmailVerified: true }); const savedAdmin = await userRepository.save(adminUser); console.log(\'🎉 Admin user created successfully!\'); console.log(\'📧 Email:\', savedAdmin.gmail); console.log(\'👤 Username:\', savedAdmin.taiKhoan); console.log(\'🔑 Password: admin123\'); console.log(\'👑 Role:\', savedAdmin.vaiTro); console.log(\'✅ Email Verified:\', savedAdmin.isEmailVerified); await AppDataSource.destroy(); })()"', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Error:', error.message);
}
