import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, imageFallback } from "../api";

const blank = { title: "", slug: "", description: "", coverImage: "", name: "", price: "", image: "", sizes: "S,M,L,XL", summary: "", content: "", number: 1, series: "", product: "" };

export default function Admin() {
  const [tab, setTab] = useState("products");
  const [data, setData] = useState({ products: [], series: [], chapters: [] });
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();

  async function loadData() {
    const [products, series, chapters] = await Promise.all([
      apiRequest("/products"), apiRequest("/series"), apiRequest("/chapters")
    ]);
    setData({ products, series, chapters });
  }
  useEffect(() => {
    if (!localStorage.getItem("qb_admin_token")) { navigate("/admin/login"); return; }
    loadData().catch((err) => { setNotice(err.message); if (err.message.toLowerCase().includes("token")) navigate("/admin/login"); });
  }, []);

  function resetForm() { setForm(blank); setEditing(null); }
  function startEdit(item) {
    setEditing(item._id);
    setForm({
      ...blank, ...item,
      series: item.series?._id || item.series || "",
      product: item.product?._id || item.product || "",
      sizes: (item.sizes || ["S", "M", "L", "XL"]).join(",")
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function save(event) {
    event.preventDefault(); setNotice("");
    const endpoint = `/${tab}`;
    let body = { ...form };
    if (tab === "products") body = { name: form.name, slug: form.slug, description: form.description, price: Number(form.price), image: form.image, sizes: form.sizes.split(",").map((x) => x.trim()).filter(Boolean) };
    if (tab === "series") body = { title: form.title, slug: form.slug, description: form.description, coverImage: form.coverImage };
    if (tab === "chapters") body = { title: form.title, slug: form.slug, summary: form.summary, content: form.content, image: form.image, number: Number(form.number), series: form.series, product: form.product || null };
    try {
      await apiRequest(editing ? `${endpoint}/${editing}` : endpoint, { method: editing ? "PUT" : "POST", body: JSON.stringify(body) });
      setNotice(editing ? "Changes saved." : "New item added.");
      resetForm(); await loadData();
    } catch (err) { setNotice(err.message); }
  }
  async function remove(id) {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try { await apiRequest(`/${tab}/${id}`, { method: "DELETE" }); setNotice("Item removed."); await loadData(); }
    catch (err) { setNotice(err.message); }
  }
  function logout() { localStorage.removeItem("qb_admin_token"); navigate("/admin/login"); }

  const list = data[tab] || [];
  const title = tab === "products" ? "Products" : tab === "series" ? "Series" : "Chapters";
  return <div className="admin-shell">
    <aside className="admin-sidebar"><div className="wordmark">QUIET BATTLES<span>™</span></div><p className="eyebrow">CONTENT MANAGEMENT</p>
      {["products", "series", "chapters"].map((item) => <button key={item} className={tab === item ? "admin-nav active" : "admin-nav"} onClick={() => { setTab(item); resetForm(); }}>{item}</button>)}
      <button className="admin-logout" onClick={logout}>Sign out</button><a href="/">View website ↗</a>
    </aside>
    <main className="admin-main"><div className="admin-top"><div><p className="eyebrow">MANAGEMENT / {title.toUpperCase()}</p><h1>{title}</h1></div><button className="button button-dark" onClick={resetForm}>NEW {tab.slice(0, -1).toUpperCase()}</button></div>
      {notice && <p className="admin-notice">{notice}</p>}
      <section className="admin-stats"><div><span>PRODUCTS</span><strong>{data.products.length}</strong></div><div><span>SERIES</span><strong>{data.series.length}</strong></div><div><span>CHAPTERS</span><strong>{data.chapters.length}</strong></div></section>
      <form className="admin-form" onSubmit={save}>
        <div className="admin-form-heading"><h2>{editing ? "Edit item" : `Add a ${tab.slice(0, -1)}`}</h2><span>{editing ? "EDITING" : "NEW ENTRY"}</span></div>
        {tab === "products" && <>
          <label>Product name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label>URL slug<input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="the-gentle-armor-tee" required /></label>
          <label>Price in INR<input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></label>
          <label>Image URL<input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></label>
          <label>Sizes, separated by commas<input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} /></label>
          <label className="wide">Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></label>
        </>}
        {tab === "series" && <>
          <label>Series title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
          <label>URL slug<input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /></label>
          <label className="wide">Cover image URL<input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} /></label>
          <label className="wide">Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></label>
        </>}
        {tab === "chapters" && <>
          <label>Chapter title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
          <label>URL slug<input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /></label>
          <label>Chapter number<input type="number" min="1" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} required /></label>
          <label>Series<select value={form.series} onChange={(e) => setForm({ ...form, series: e.target.value })} required><option value="">Choose series</option>{data.series.map((s) => <option value={s._id} key={s._id}>{s.title}</option>)}</select></label>
          <label>Related product<select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}><option value="">No product</option>{data.products.map((p) => <option value={p._id} key={p._id}>{p.name}</option>)}</select></label>
          <label className="wide">Image URL<input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></label>
          <label className="wide">Short summary<textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required /></label>
          <label className="wide">Story content<textarea rows="7" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required /></label>
        </>}
        <div className="admin-form-actions"><button className="button button-dark">{editing ? "SAVE CHANGES" : "ADD ITEM"}</button>{editing && <button type="button" className="button button-outline" onClick={resetForm}>CANCEL</button>}</div>
      </form>
      <section className="admin-list"><div className="admin-list-heading"><h2>Current {title.toLowerCase()}</h2><span>{list.length} items</span></div>
        {list.map((item) => <div className="admin-row" key={item._id}>
          <img src={item.image || item.coverImage || imageFallback} alt="" />
          <div><strong>{item.name || item.title}</strong><p>{item.slug} {item.price !== undefined ? `· ₹${item.price}` : ""}</p></div>
          <div className="admin-row-actions"><button onClick={() => startEdit(item)}>Edit</button><button onClick={() => remove(item._id)}>Delete</button></div>
        </div>)}
      </section>
    </main>
  </div>;
}
