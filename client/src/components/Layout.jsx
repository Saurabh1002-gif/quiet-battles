import { Link, NavLink, Outlet } from "react-router-dom";
import { useCart } from "./CartContext";

const chapters = [
  ["The Quiet Beginning", "the-quiet-beginning"],
  ["The Weight We Carry", "the-weight-we-carry"],
  ["Room to Breathe", "room-to-breathe"],
  ["Softness Is Strength", "softness-is-strength"],
  ["What Remains", "what-remains"]
];

export default function Layout() {
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <>
      <div className="announcement">A STUDY IN STRENGTH · SERIES 01 NOW IN THE ARCHIVE</div>
      <header className="site-header">
        <Link className="wordmark" to="/">QUIET BATTLES<span>™</span></Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/archive">The Archive</NavLink>
          <NavLink to="/series/the-gentle-armor">Series 01</NavLink>
          <details className="nav-dropdown">
            <summary>Chapters <span>⌄</span></summary>
            <div className="nav-dropdown-menu">
              {chapters.map(([title, slug], index) => (
                <NavLink key={slug} to={`/chapter/${slug}`}>
                  <span>0{index + 1}</span>{title}
                </NavLink>
              ))}
            </div>
          </details>
          <NavLink to="/product/the-gentle-armor-tee">The Object</NavLink>
          <a href="/#about">Our Story</a>
        </nav>
        <Link className="cart-link" to="/cart">Bag ({count})</Link>
      </header>
      <main><Outlet /></main>
      <footer className="footer">
        <div><Link className="wordmark" to="/">QUIET BATTLES<span>™</span></Link><p>WEAR YOUR BATTLES.</p><Link className="footer-admin-link" to="/admin/login">CONTENT MANAGEMENT ↗</Link></div>
        <div className="footer-right"><span>BUILT FOR THE UNSEEN.</span><span>© {new Date().getFullYear()} QUIET BATTLES</span></div>
      </footer>
    </>
  );
}
