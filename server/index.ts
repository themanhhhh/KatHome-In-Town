import "reflect-metadata";
import { AppDataSource } from './data/datasource';
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes';
import dotenv from 'dotenv';
import { BookingCleanupService } from './services/BookingCleanupService';
import { EmailService } from './services/EmailService';

const app = express();
const port = 3001;

dotenv.config();
// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Khởi tạo kết nối database
AppDataSource.initialize()
  .then(async () => {
    console.log("✅ Kết nối DB thành công!");

    // THEO FLOWCHART: Start booking cleanup job (chạy mỗi 5 phút)
    console.log("🧹 Starting booking cleanup service...");
    BookingCleanupService.startCleanupJob();

    // Test email service
    const emailReady = await EmailService.testConnection();
    if (emailReady) {
      console.log("✉️ Email service is ready");
    } else {
      console.warn("⚠️ Email service is not configured properly");
    }

    // Routes
    app.use('/api', apiRoutes);

    // Root endpoint
    app.get('/', (req, res) => {
      res.json({ 
        message: 'Booking Website API',
        version: '2.0.0 - Theo Flowchart',
        endpoints: '/api',
        features: [
          'Optimistic locking',
          'Booking timeout (15 min)',
          'Server-side pricing',
          'Email with QR code',
          'Staff notifications',
          'Auto cleanup expired bookings'
        ]
      });
    });

    // Khởi động server
    app.listen(port, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
      console.log(`📚 API endpoint: http://localhost:${port}/api`);
      console.log(`🔄 Booking cleanup job is running every 5 minutes`);
    });
  })
  .catch((error) => console.log("❌ Lỗi kết nối DB:", error));
