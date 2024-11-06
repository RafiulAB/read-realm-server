import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan'
import dbConnect from './config/connectDb';
import bookRouter from './routes/bookRoute';
import bodyParser from 'body-parser';
import authRouter from './routes/authRoute'
import dotenv from 'dotenv';
import Stripe from 'stripe';


dotenv.config();
const app = express();
const port = 8000;
dbConnect()



app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


const stripeSecretKey ='sk_test_51OqHkhLpHAuAr7q1kFwME9slD1PcIqibP1i7Z6bMsM8fhqO21EH23XrH8eh2bAuZm6Zl9m8tqbq9bhoFwsCDyu0Z00opU6FGQO';
const stripeInstance = new Stripe(stripeSecretKey);
//use book route
app.use('/books', bookRouter)
//auth route 
app.use('/auth', authRouter)



app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript and Express!!');
});

app.listen(port, () => {
  console.log(`Server is running on port${port}`);
});


//payment
// Payment route
app.post('/create-checkout', async (req: Request, res: Response) => {
  try {
    const { products } = req.body;

    const lineItems = products.map((product: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          images: [product.image], // Corrected field name
          metadata: { file: product.file }, // Added metadata field
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: 1, // Set quantity as needed
    }));

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://read-realm.vercel.app/success',
      cancel_url: 'https://read-realm.vercel.app/cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});
