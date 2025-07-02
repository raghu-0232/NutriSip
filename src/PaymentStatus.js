import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentStatus = () => {
  const location = useLocation();
  const [status, setStatus] = useState('processing');
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'failed') {
      setTimeout(() => {
        navigate('/'); // Redirect to the main page where the cart is displayed
      }, 3000); // Redirect after 3 seconds
    }

    const queryParams = new URLSearchParams(location.search);
    const transactionId = queryParams.get('transactionId');

    if (!transactionId) {
      setStatus('invalid');
      return;
    }

    const pollingInterval = 5000; // Poll every 5 seconds
    const maxPollingDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
    let pollingTimer = 0;

    const fetchOrderStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/orders/${transactionId}`);
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

    // Initial fetch
    fetchOrderStatus();

    const intervalId = setInterval(() => {
      if (status === 'processing' && pollingTimer < maxPollingDuration) {
        fetchOrderStatus();
        pollingTimer += pollingInterval;
      } else {
        clearInterval(intervalId);
        if (status === 'processing') {
          setStatus('unknown'); // Set to unknown if still processing after max duration
        }
      }
    }, pollingInterval);

    return () => clearInterval(intervalId); // Cleanup on unmount

  }, [location, navigate, status]);

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
