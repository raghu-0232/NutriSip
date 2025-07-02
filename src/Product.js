
import React, { useState, useEffect } from 'react';

const Product = ({ product, onSelect, cart }) => {
  const [grams, setGrams] = useState(0);

  useEffect(() => {
    const cartItem = cart.find(item => item.product.id === product.id);
    if (cartItem) {
      setGrams(cartItem.grams);
    } else {
      setGrams(0);
    }
  }, [cart, product.id]);

  const handleDecrement = () => {
    const newGrams = Math.max(0, grams - 10);
    setGrams(newGrams);
    onSelect(product, newGrams);
  };

  const handleIncrement = () => {
    const newGrams = grams + 10;
    setGrams(newGrams);
    onSelect(product, newGrams);
  };

  return (
    <div className="product">
      {grams > 0 && <div className="selection-dot"></div>}
      <img src={product.image} alt={product.name} className="product-image" />
      <h3>{product.name}</h3>
      <p>{product.price} per 100g</p>
      <div className="quantity-selector">
        <button onClick={handleDecrement}>-</button>
        <span>{grams}g</span>
        <button onClick={handleIncrement}>+</button>
      </div>
    </div>
  );
};

export default Product;
