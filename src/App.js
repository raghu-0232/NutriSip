import { useState, useEffect } from 'react';
import Product from './Product';

import './App.css';

const images = {
  almonds: require('./img/almonds.jpg'),
  cashews: require('./img/cashews.jpg'),
  walnuts: require('./img/walnuts.jpg'),
  pistachios: require('./img/pistachios.jpg'),
  raisins: require('./img/raisins.jpg'),
  dates: require('./img/dates.jpg'),
  apricots: require('./img/apricots.jpg'),
  figs: require('./img/figs.jpg'),
  hazelnuts: require('./img/hazelnuts.jpg'),
  brazilnuts: require('./img/brazilnuts.jpg'),
};

function App() {
  const [products] = useState([
    { id: 1, name: 'Almonds', price: '₹60', image: images.almonds },
    { id: 2, name: 'Cashews', price: '₹80', image: images.cashews },
    { id: 3, name: 'Walnuts', price: '₹100', image: images.walnuts },
    { id: 4, name: 'Pistachios', price: '₹120', image: images.pistachios },
    { id: 5, name: 'Raisins', price: '₹40', image: images.raisins },
    { id: 6, name: 'Dates', price: '₹50', image: images.dates },
    { id: 7, name: 'Apricots', price: '₹70', image: images.apricots },
    { id: 8, name: 'Figs', price: '₹90', image: images.figs },
    { id: 9, name: 'Hazelnuts', price: '₹110', image: images.hazelnuts },
    { id: 10, name: 'Brazil Nuts', price: '₹130', image: images.brazilnuts },
  ]);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const websocketUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:5001';
    const ws = new WebSocket(websocketUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send('Hello from frontend!');
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSelect = (product, grams) => {
    if (grams === 0) {
      setCart(cart.filter((item) => item.product.id !== product.id));
    } else {
      const existingProduct = cart.find((item) => item.product.id === product.id);

      if (existingProduct) {
        const updatedCart = cart.map((item) =>
          item.product.id === product.id ? { ...item, grams } : item
        );
        setCart(updatedCart);
      } else {
        setCart([...cart, { product, grams }]);
      }
    }
  };

  const total = cart.reduce((acc, item) => {
    const price = parseInt(item.product.price.replace('₹', ''));
    return acc + (price / 100) * item.grams;
  }, 0);

  return (
    <div className="App">
      <div className="restaurant-suggestions">
        <h2>Chef's Recommendations</h2>
        <p>Inspired by the finest restaurants, here are some exquisite dry fruit pairings:</p>
        <ul>
          <li><strong>The Golden Blend:</strong> Apricots, Dates, and Cashews - A sweet and creamy delight.</li>
          <li><strong>Mediterranean Medley:</strong> Figs, Pistachios, and Almonds - A savory and rich combination.</li>
          <li><strong>Forest Forage:</strong> Walnuts, Hazelnuts, and Brazil Nuts - Earthy and robust flavors.</li>
        </ul>
      </div>
      <div className="product-list">
        {products.map((product) => (
          <Product key={product.id} product={product} onSelect={handleSelect} cart={cart} />
        ))}
      </div>
      <div className="cart">
        <h2>Your Cart</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.product.name} - {item.grams}g (₹{(parseInt(item.product.price.replace('₹', '')) / 100 * item.grams).toFixed(2)})
            </li>
          ))}
        </ul>
        <h3>Total: ₹{total.toFixed(2)}</h3>
      </div>
    </div>
  );
}

export default App;
