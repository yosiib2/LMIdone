import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import bodyParser from 'body-parser';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoutes.js';

const app = express();

(async () => {
  // Connect to database and cloud storage
  await connectDB();
  await connectCloudinary();

  // Global middlewares
  app.use(cors());
  app.use(clerkMiddleware());

  // Basic test route
  app.get('/', (req, res) => res.send('API Working'));

  // Course routes
  app.use('/api/course', express.json(), courseRouter);
  app.use('/api/user',express.json(), userRouter)

  // Clerk webhook route (needs raw body)
  app.post(
    '/clerk',
    bodyParser.raw({ type: 'application/json' }),
    clerkWebhooks
  );

  // Educator routes
  app.use('/api/educator', express.json(), educatorRouter);
  app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);


  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();
