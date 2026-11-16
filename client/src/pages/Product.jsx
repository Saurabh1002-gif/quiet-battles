import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest, imageFallback } from "../api";
import { useCart } from "../components/CartContext";
import Loading from "../components/Loading";

export default function Product() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");
  const [message, setMessage] = useState("");
  const { addToCart } = useCart();
  useEffect(() => { apiRequest(`/products/${slug}`).then((data) => { setProduct(data); setSize(data.sizes?.[0] || "M"); }).catch(() => setProduct(false)); }, [slug]);
  if (product === null) return <Loading />;
  if (!product) return <div className="page-wrap">This product could not be found.</div>;
  function handleAdd() {
    if (!size) { setMessage("Please choose a size first."); return; }
    addToCart(product, size);
    setMessage("Added to your bag.");
  }
  return <section className="product-page">
    <div className="product-photo"><img src={product.image || imageFallback} alt={product.name} /></div>
    <div className="product-info">
      <p className="eyebrow"><Link to="/archive">THE ARCHIVE</Link> / QUIET BATTLES™ / THE OBJECT</p>
      <h1>{product.name}</h1><p className="product-price">₹{product.price}</p>
      <p className="product-description">{product.description}</p>
      <div className="size-heading"><span>SELECT SIZE</span><span>SIZE GUIDE</span></div>
      <div className="size-list">{(product.sizes || ["S", "M", "L", "XL"]).map((item) =>
        <button key={item} className={size === item ? "size-button selected" : "size-button"} onClick={() => setSize(item)}>{item}</button>
      )}</div>
      <button className="button button-dark add-button" onClick={handleAdd}>ADD TO BAG <span>↗</span></button>
      {message && <p className="form-message">{message}</p>}
      <div className="product-note"><p>CONSIDERED IN EVERY DETAIL.</p><p>Designed as a reminder of the strength you already carry.</p><ul><li>Relaxed everyday fit</li><li>Available in sizes {(product.sizes || []).join(", ")}</li><li>Carefully considered essential</li></ul></div>
    </div>
  </section>;
}
