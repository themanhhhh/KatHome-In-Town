const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up KatHome Server...\n');

// 1. Kiểm tra file .env
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  const envContent = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password_here
DB_NAME=postgres

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# SMTP Configuration (Optional - for email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here

# Client URL
CLIENT_URL=http://localhost:3000

# Server Port
PORT=3001`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created! Please update the database password.');
} else {
  console.log('✅ .env file already exists');
}

// 2. Cài đặt dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully!');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// 3. Chạy migrations
console.log('\n🗄️ Running database migrations...');
try {
  execSync('npx typeorm-ts-node-commonjs migration:run -d ./data/datasource.ts', { stdio: 'inherit' });
  console.log('✅ Database migrations completed successfully!');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.log('\n💡 Make sure:');
  console.log('1. PostgreSQL is running');
  console.log('2. Database "postgres" exists');
  console.log('3. Username/password in .env is correct');
  console.log('4. User has permission to create tables');
}

console.log('\n🎉 Setup completed!');
console.log('\n📋 Next steps:');
console.log('1. Update .env file with your database credentials');
console.log('2. Run: npm run dev');
console.log('3. Import seed data using pgAdmin (optional)');
