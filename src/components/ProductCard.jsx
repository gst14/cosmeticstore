import { pct } from "../lib/catalog.js";
import ProductVisual from "./ProductVisual.jsx";
import Price from "./Price.jsx";

export default function ProductCard({ product: p, index, onOpen }) {
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(p); }
  };
  return (
    <article
      className="card" tabIndex={0} role="button"
      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
      onClick={() => onOpen(p)} onKeyDown={onKeyDown}
    >
      <div className="media" style={{ "--tint": p.tonos[0] }}>
        <ProductVisual product={p} />
        <div className="badges">
          {p.stock === 0 && <span className="badge out">Sin stock</span>}
          {p.oferta && <span className="badge sale">−{pct(p)}%</span>}
          {p.nuevo && <span className="badge">Nuevo</span>}
        </div>
      </div>
      <div className="info">
        <span className="maker">{p.marca}</span>
        <h2 className="name">{p.nombre}</h2>
        <p className="desc">{p.descripcion}</p>
        <div className="meta">
          {p.contenido && <span>{p.contenido}</span>}
          {p.tonos.length > 1 && <>
            <span className="dots">
              {p.tonos.slice(0, 4).map((t, i) => <i key={i} style={{ background: t }} />)}
              {p.tonos.length > 4 && <small>+{p.tonos.length - 4}</small>}
            </span>
            <span>{p.tonos.length} tonos</span>
          </>}
        </div>
      </div>
      <Price product={p} />
    </article>
  );
}
