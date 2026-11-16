import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest, imageFallback } from "../api";
import Loading from "../components/Loading";

export default function Chapter() {
  const { slug } = useParams();
  const [chapter, setChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([apiRequest(`/chapters/${slug}`), apiRequest("/chapters")])
      .then(([current, all]) => {
        if (!active) return;
        setChapter(current);
        setChapters(all.filter((item) => String(item.series?._id || item.series) === String(current.series?._id || current.series)).sort((a, b) => a.number - b.number));
      })
      .catch((err) => { if (active) { setChapter(false); setError(err.message); } });
    return () => { active = false; };
  }, [slug]);

  if (chapter === null) return <Loading />;
  if (!chapter) return <section className="page-wrap not-found"><p className="eyebrow">THE ARCHIVE / STORY</p><h1>THIS CHAPTER<br /><em>IS NOT HERE.</em></h1><p>{error || "The requested chapter could not be found."}</p><Link className="button button-dark" to="/series/the-gentle-armor">RETURN TO SERIES 01</Link></section>;

  const index = chapters.findIndex((item) => item.slug === chapter.slug);
  const previous = index > 0 ? chapters[index - 1] : null;
  const next = index >= 0 && index < chapters.length - 1 ? chapters[index + 1] : null;
  const paragraphs = (chapter.content || "").split("\n").filter(Boolean);

  return <article className="story-page">
    <div className="story-top"><Link to={`/series/${chapter.series?.slug || "the-gentle-armor"}`}>← BACK TO THE SERIES</Link><p className="eyebrow">CHAPTER {String(chapter.number).padStart(2, "0")} / 05</p></div>
    <header className="story-heading"><p className="eyebrow">THE ARCHIVE / {chapter.series?.title || "SERIES 01"}</p><h1>{chapter.title}<em>.</em></h1><p>{chapter.summary}</p></header>
    <figure className="story-figure"><img className="story-cover" src={chapter.image || imageFallback} alt={chapter.title} /><figcaption>QUIET BATTLES™ · SERIES 01 · CHAPTER {String(chapter.number).padStart(2, "0")}</figcaption></figure>
    <section className="story-content"><div><p className="eyebrow">A QUIET BATTLE</p><p className="story-side-note">Not every story needs an audience to matter.</p></div><div className="story-text">{paragraphs.map((line, i) => <p key={i}>{line}</p>)}</div></section>
    <section className="story-quote"><p className="eyebrow">A THOUGHT TO CARRY</p><blockquote>“{chapter.summary}”</blockquote></section>
    {chapter.product && <section className="story-product"><img src={chapter.product.image || imageFallback} alt={chapter.product.name} /><div><p className="eyebrow">THE PIECE THAT CARRIES THE STORY</p><h2>{chapter.product.name}</h2><p>Designed as a wearable reminder of the strength you already carry.</p><strong>₹{chapter.product.price}</strong><Link className="text-link" to={`/product/${chapter.product.slug}`}>DISCOVER THE PIECE ↗</Link></div></section>}
    <nav className="chapter-pagination" aria-label="Chapter navigation">{previous ? <Link to={`/chapter/${previous.slug}`}><span>← PREVIOUS CHAPTER</span><strong>{previous.title}</strong></Link> : <span />}{next ? <Link to={`/chapter/${next.slug}`}><span>NEXT CHAPTER →</span><strong>{next.title}</strong></Link> : <Link to={`/series/${chapter.series?.slug || "the-gentle-armor"}`}><span>RETURN TO</span><strong>THE SERIES ↗</strong></Link>}</nav>
  </article>;
}
