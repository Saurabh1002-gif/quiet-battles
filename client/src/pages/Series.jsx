import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest, imageFallback } from "../api";
import Loading from "../components/Loading";

export default function Series() {
  const { slug } = useParams();
  const [series, setSeries] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([apiRequest(`/series/${slug}`), apiRequest(`/chapters?seriesSlug=${slug}`)])
      .then(([s, c]) => { setSeries(s); setChapters(c); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [slug]);
  if (loading) return <Loading />;
  if (!series) return <div className="page-wrap">This series could not be found.</div>;
  return <>
    <section className="series-hero">
      <img src={series.coverImage || imageFallback} alt={series.title} />
      <div className="series-hero-copy"><p className="eyebrow">THE ARCHIVE / SERIES 01</p><h1>{series.title}</h1><p>{series.description}</p></div>
    </section>
    <section className="series-introduction page-wrap"><p className="eyebrow">A STUDY IN STRENGTH</p><h2>THE ART OF<br /><em>STAYING SOFT.</em></h2><p>{series.description}</p></section>
    <section className="page-wrap series-chapters">
      <div className="section-title-row"><div><p className="eyebrow">FIVE PARTS · ONE STORY</p><h2>THE CHAPTERS</h2></div><span>01 — 05</span></div>
      <div className="chapter-grid">{chapters.map((chapter, index) =>
        <Link to={`/chapter/${chapter.slug}`} className="chapter-card" key={chapter._id}>
          <div className="chapter-image"><img src={chapter.image || imageFallback} alt={chapter.title} /><span>CHAPTER {String(chapter.number || index + 1).padStart(2, "0")}</span></div>
          <h3>{chapter.title}</h3><p>{chapter.summary}</p>
        </Link>
      )}</div>
      {chapters.length === 0 && <p className="muted">The chapters are being prepared. Please return soon.</p>}
    </section>
  </>;
}
