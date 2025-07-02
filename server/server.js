const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const mysql = require('mysql2/promise');
const app = express();
const port = 5000;

app.use(express.json());

const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY;
const PHONEPE_API_KEY = process.env.PHONEPE_API_KEY;
const PHONEPE_HOST_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'Raghu123@',
  database: process.env.MYSQL_DATABASE || 'nutrisip',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function createOrdersTable() {
  try {
    const connection = await pool.getConnection();
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        phone_number VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    connection.release();
    console.log('Orders table checked/created successfully.');
  } catch (err) {
    console.error('Error creating orders table:', err);
  }
}

createOrdersTable();

app.post('/api/orders', async (req, res) => {
  const { amount, phoneNumber } = req.body;
  const orderId = `ORD${Date.now()}`;
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO orders (id, amount, status, phone_number) VALUES (?, ?, ?, ?)',
      [orderId, amount, 'pending', phoneNumber]
    );
    connection.release();
    res.json({ orderId });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send('Error creating order');
  }
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

    try {
      const connection = await pool.getConnection();
      await connection.execute(
        'UPDATE orders SET status = ? WHERE id = ?',
        [orderStatus, transactionId]
      );
      connection.release();
      res.send('Callback received and verified');
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).send('Error updating order status');
    }
  } else {
    console.error('Callback verification failed:', req.body);
    res.status(400).send('Callback verification failed');
  }
});

app.get('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT id, amount, status FROM orders WHERE id = ?',
      [orderId]
    );
    connection.release();
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).send('Order not found');
    }
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).send('An error occurred while fetching order details.');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});