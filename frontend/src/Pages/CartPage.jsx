import React from 'react'
import { Navbar } from '../componets/navbar'
import { Footer } from '../componets/footer'
import { useCartStore } from '../stores/useCartStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faMinus, faPlus, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import '../Styles/CartPage.css'

export const CartPage = () => {
  const { items, addItem, removeItem, clearCart } = useCartStore()

  const increase = (product) => addItem(product, 1)
  const decrease = (product) => {
    if ((product.quantity || 1) <= 1) {
      removeItem(product.id)
    } else {
      // add negative quantity to decrease
      addItem(product, -1)
    }
  }

  const subtotal = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0)
  const delivery = items.length > 0 ? 20 : 0
  const total = subtotal + delivery

  return (
    <div className="cart-page">
      <Navbar />

      <section className="cart-container">
        <div className="cart-header">
          <h1><FontAwesomeIcon icon={faShoppingCart} /> Your Cart</h1>
          {items.length > 0 && (
            <button className="clear-btn" onClick={clearCart}><FontAwesomeIcon icon={faTrash} /> Clear</button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="seller">By {item.farmer}</p>
                    <div className="price">₹{item.price} <span className="unit">/ {item.unit}</span></div>
                  </div>
                  <div className="item-actions">
                    <div className="qty">
                      <button onClick={() => decrease(item)} className="qty-btn"><FontAwesomeIcon icon={faMinus} /></button>
                      <span className="qty-val">{item.quantity || 1}</span>
                      <button onClick={() => increase(item)} className="qty-btn"><FontAwesomeIcon icon={faPlus} /></button>
                    </div>
                    <button className="remove-btn" onClick={() => removeItem(item.id)}><FontAwesomeIcon icon={faTrash} /></button>
                  </div>
                  <div className="line-total">₹{(item.price * (item.quantity || 1)).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <aside className="summary">
              <h3>Order Summary</h3>
              <div className="row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="row"><span>Delivery</span><span>₹{delivery.toFixed(2)}</span></div>
              <div className="row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
              <button className="checkout-btn">Checkout & Pay</button>
              <p className="note">Demo checkout — integrate payment gateway later.</p>
            </aside>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

export default CartPage


