const express = require('express')
const app = express()
require('dotenv').config();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const sendgridMail = require('@sendgrid/mail');
sendgridMail.setApiKey(process.env.SENDGRID_APIKEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const corsOptions = {
  origin: '*', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
  allowedHeaders: 'Content-Type, Authorization' 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {
    const { email, service, startTime, bill, stripePaymentLink } = req.body;
  
    const msg = {
      to: email,
      from: 'oumabarack1047@gmail.com',
      subject: 'Booking Confirmation',
      text: `Your ${service} session has been booked for ${startTime}. Your bill is $${bill.toFixed(2)}. Payment link: ${stripePaymentLink}`,
    };
  
    try {
      await sendgridMail.send(msg);
      console.log('Email sent successfully');
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, error: error.toString() });
    }
  });


  
  app.post('/create-checkout-session', async (req, res) => {
    const { amount, email, service } = req.body;
    console.log('email for this user ', email);
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${process.env.DOMAIN}/success?email=${encodeURIComponent(email)}&amount=${amount}&service=${encodeURIComponent(service)}&from_stripe=true`,
        cancel_url: `${process.env.DOMAIN}/cancel&from_stripe=true`,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Service Payment',
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
      });
  
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  app.get('/success', async (req, res) => {
    const { email, amount, service } = req.query;
    try {
      const paymentTime = new Date();
  
      // Send email notification
      await sendEmail(
        email,
        'Payment Successful',
        `Payment successful! Amount: $${amount} Service: ${service} Paid at: ${paymentTime.toLocaleString()}`
      );

      res.redirect(`${process.env.FRONTEND_URL}/success`);
    } catch (error) {
     
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  app.get('/cancel', async (req, res) => {
    const { email, amount, service } = req.query;
  
    try {
      const paymentTime = new Date();
      // Store details in db
  
      // Send email notification
      await sendEmail(
        email,
        'Payment Cancelled',
        `Payment cancelled. Amount: $${amount} Service: ${service}
         Paid at: ${paymentTime.toLocaleString()}`
      );
      res.redirect(`${process.env.FRONTEND_URL}/cancel`);
    } catch (error) {
     
      res.status(500).json({ error: 'An error occurred' });
    }
  });

app.listen(port, () => {
    console.log(`Server is Listening on port ${port}`)
})