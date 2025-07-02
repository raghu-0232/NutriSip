import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentStatus = () => {
  const location = useLocation();
  const [status, setStatus] = useState('processing');
  

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const transactionId = queryParams.get('transactionId'); // Assuming PhonePe returns transactionId
    

    if (transactionId) {
      const fetchOrderStatus = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/orders/${transactionId}`);
          const data = await response.json();
          if (response.ok) {
            setStatus(data.status);
          } else {
            setStatus('unknown');
            console.error('Error fetching order status:', data.message);
          }
        } catch (error) {
          setStatus('unknown');
          console.error('Error fetching order status:', error);
        }
      };
      fetchOrderStatus();
    } else {
      setStatus('invalid');
    }
  }, [location]);

  return (
    <div>
      <h1>Payment Status</h1>
      {status === 'processing' && <p>Your payment is being processed. Please wait...</p>}
      {status === 'success' && <p>Payment Successful! Thank you for your purchase.</p>}
      {status === 'failed' && <p>Payment Failed. Please try again.</p>}
      {status === 'unknown' && <p>Payment status is unknown. Please check your order history.</p>}
      {status === 'invalid' && <p>Invalid payment status link.</p>}
    </div>
  );
};

export default PaymentStatus;