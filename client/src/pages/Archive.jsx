import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, imageFallback } from "../api";
import Loading from "../components/Loading";

export default function Archive() {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { apiRequest("/series").then(setSeries).catch(() => {}).finally(() => setLoading(false)); }, []);
  return <section className="page-wrap">
    <div className="page-heading"><p className="eyebrow">A RECORD OF WHAT WE CARRY</p><h1>THE <em>ARCHIVE.</em></h1><p>Collections built around the stories that shape us.</p></div>
    {loading ? <Loading /> : <div className="series-grid">{series.map((item, index) =>
      <Link className="series-card" to={`/series/${item.slug}`} key={item._id}>
        <div className="series-card-image"><img src={item.coverImage || imageFallback} alt={item.title} /><span>0{index + 1}</span></div>
        <div className="card-meta"><div><p className="eyebrow">SERIES 0{index + 1}</p><h2>{item.title}</h2></div><span>↗</span></div>
        <p className="muted">{item.description}</p>
      </Link>
    )}</div>}
  </section>;
}
