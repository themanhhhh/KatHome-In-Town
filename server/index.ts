import "reflect-metadata";
import { AppDataSource } from './data/datasource';
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes';

const app = express();
const port = 3001;

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

    // Routes
    app.use('/api', apiRoutes);

    // Root endpoint
    app.get('/', (req, res) => {
      res.json({ 
        message: 'Booking Website API',
        version: '1.0.0',
        endpoints: '/api'
      });
    });

    // Khởi động server
    app.listen(port, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
      console.log(`📚 API endpoint: http://localhost:${port}/api`);
    });
  })
  .catch((error) => console.log("❌ Lỗi kết nối DB:", error));
