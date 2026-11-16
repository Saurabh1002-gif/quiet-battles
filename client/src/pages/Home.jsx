import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, imageFallback } from "../api";
import Loading from "../components/Loading";

export default function Home() {
  const [series, setSeries] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiRequest("/series"), apiRequest("/products")])
      .then(([seriesData, productData]) => {
        setSeries(seriesData[0] || null);
        setProduct(productData[0] || null);
      }).catch(() => { setSeries(null); setProduct(null); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  return (
    <>
      <section className="hero">
        <img src={series?.coverImage || imageFallback} alt="Quiet Battles editorial collection" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">AN EXPRESSION OF THE UNSEEN</p>
          <h1>WEAR YOUR<br /><em>BATTLES.</em></h1>
          <p className="hero-sub">Not every fight is visible. Not every victory needs an audience.</p>
          <Link className="button button-light" to="/archive">ENTER THE ARCHIVE <span>↗</span></Link>
        </div>
        <div className="hero-index">01 / 05</div>
      </section>

      <section className="intro section-wrap" id="about">
        <p className="eyebrow">A NOTE FROM THE BRAND</p>
        <h2>Some of the strongest things<br />we carry are <em>never seen.</em></h2>
        <p className="body-copy">QUIET BATTLES is a study of the quiet strength behind every person. A wardrobe shaped by resilience, intention, and the stories we carry with us.</p>
      </section>

      {series && <section className="feature-series">
        <div className="feature-image"><img src={series.coverImage || imageFallback} alt={series.title} /></div>
        <div className="feature-copy">
          <p className="eyebrow">THE FIRST COLLECTION · SERIES 01</p>
          <h2>{series.title}</h2>
          <p>{series.description}</p>
          <Link className="text-link" to={`/series/${series.slug}`}>DISCOVER THE SERIES ↗</Link>
        </div>
      </section>}

      {product && <section className="product-feature section-wrap">
        <div><p className="eyebrow">THE OBJECT</p><h2>Made to carry<br /><em>meaning.</em></h2></div>
        <Link className="product-feature-card" to={`/product/${product.slug}`}>
          <img src={product.image || imageFallback} alt={product.name} />
          <div><span>{product.name}</span><span>₹{product.price}</span></div>
        </Link>
      </section>}
    </>
  );
}
