import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../components/CartContext";
import { imageFallback } from "../api";

export default function Cart() {
  const { items, total, changeQuantity, removeItem } = useCart();
  const [checkoutMessage, setCheckoutMessage] = useState("");
  return <section className="page-wrap cart-page">
    <div className="page-heading"><p className="eyebrow">YOUR SELECTION</p><h1>THE <em>BAG.</em></h1></div>
    {!items.length ? <div className="empty-cart"><p>Your bag is currently empty.</p><Link className="button button-dark" to="/archive">EXPLORE THE ARCHIVE</Link></div> :
      <div className="cart-layout"><div className="cart-items">{items.map((item) =>
        <div className="cart-item" key={`${item._id}-${item.size}`}>
          <img src={item.image || imageFallback} alt={item.name} />
          <div className="cart-item-info"><h3>{item.name}</h3><p>Size: {item.size}</p><p>₹{item.price}</p><div className="quantity"><button onClick={() => changeQuantity(item._id, item.size, -1)}>−</button><span>{item.quantity}</span><button onClick={() => changeQuantity(item._id, item.size, 1)}>+</button></div></div>
          <button className="remove-button" onClick={() => removeItem(item._id, item.size)}>REMOVE</button>
        </div>
      )}</div><aside className="cart-summary"><p className="eyebrow">ORDER SUMMARY</p><div><span>Subtotal</span><strong>₹{total.toLocaleString("en-IN")}</strong></div><p>Shipping and taxes are calculated at checkout.</p><button className="button button-dark" onClick={() => setCheckoutMessage("Online payment is not available yet.")}>CONTINUE TO CHECKOUT</button>{checkoutMessage && <p className="form-message" role="status">{checkoutMessage}</p>}</aside></div>}
  </section>;
}
