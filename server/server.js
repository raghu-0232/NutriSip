const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const app = express();
const port = 5000;

app.use(express.json());

const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const PHONEPE_API_KEY = process.env.PHONEPE_API_KEY;
const PHONEPE_HOST_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox';

// In-memory store for orders
const orders = {};

app.post('/api/orders', async (req, res) => {
  const { amount, phoneNumber } = req.body;
  const orderId = `ORD${Date.now()}`;
  orders[orderId] = {
    id: orderId,
    amount,
    status: 'pending',
    phoneNumber,
    created_at: new Date().toISOString()
  };
  console.log('Order created:', orders[orderId]);
  res.json({ orderId });
});

app.post('/pay', async (req, res) => {
  const { amount, number, orderId } = req.body;

  const data = {
    merchantId: PHONEPE_MERCHANT_ID,
    merchantTransactionId: orderId,
    merchantUserId: 'MUID123',
    amount: amount * 100, // Amount in paise
    redirectUrl: process.env.PHONEPE_REDIRECT_URL || `http://localhost:3000/payment-status`,
    redirectMode: 'REDIRECT',
    callbackUrl: 'http://localhost:5000/payment-callback',
    mobileNumber: number,
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
  };

  const payload = JSON.stringify(data);
  const payloadMain = Buffer.from(payload).toString('base64');
  const keyIndex = 1;
  const string = payloadMain + '/pg/v1/pay' + PHONEPE_SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = sha256 + '###' + keyIndex;

  const options = {
    method: 'post',
    url: `${PHONEPE_HOST_URL}/v1/pay`,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
    },
    data: {
      request: payloadMain,
    },
  };

  try {
    const response = await axios(options);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.post('/payment-callback', async (req, res) => {
  const { transactionId, providerReferenceId, amount, status, code } = req.body;
  const xVerify = req.headers['x-verify'];

  const string = JSON.stringify(req.body) + PHONEPE_SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const expectedXVerify = sha256 + '###' + 1; // Assuming keyIndex is 1

  if (xVerify === expectedXVerify) {
    console.log('Callback verified:', req.body);
    let orderStatus = 'failed';
    if (code === 'PAYMENT_SUCCESS') {
      orderStatus = 'success';
    } else if (code === 'PAYMENT_ERROR') {
      orderStatus = 'failed';
    }

    if (orders[transactionId]) {
      orders[transactionId].status = orderStatus;
      console.log('Order status updated:', orders[transactionId]);
    } else {
      console.error('Order not found for callback:', transactionId);
    }
    res.send('Callback received and verified');
  } else {
    console.error('Callback verification failed:', req.body);
    res.status(400).send('Callback verification failed');
  }
});

app.get('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const order = orders[orderId];
  if (order) {
    res.json(order);
  } else {
    res.status(404).send('Order not found');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});