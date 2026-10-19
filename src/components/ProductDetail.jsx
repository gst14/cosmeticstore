import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config.js";
import ProductVisual from "./ProductVisual.jsx";
import Price from "./Price.jsx";

function StockText({ stock }) {
  if (stock == null) return null;
  if (stock === 0) return <span className="stock-out">Sin stock por ahora</span>;
  if (stock <= CONFIG.LOW_STOCK) return <span className="stock-low">Últimas {stock} unidades</span>;
  return <span className="stock-ok">Disponible</span>;
}

export default function ProductDetail({ product: p, onClose }) {
  const ref = useRef(null);
  const [tone, setTone] = useState(p.tonos[0]);
  const [copyLabel, setCopyLabel] = useState("Copiar código");

  useEffect(() => {
    const dlg = ref.current;
    dlg.showModal();
    return () => dlg.open && dlg.close();
  }, []);

  const toneIdx = p.tonos.indexOf(tone) + 1;
  const msg = `Hola! Me interesa el producto ${p.nombre} (${p.codigo})${p.tonos.length > 1 ? ` en el tono ${toneIdx}` : ""}. ¿Está disponible?`;

  const copyCode = () => {
    (navigator.clipboard?.writeText(p.codigo) || Promise.reject())
      .then(() => setCopyLabel("Código copiado"))
      .catch(() => setCopyLabel(p.codigo));
  };

  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => e.target === ref.current && ref.current.close()}>
      <button className="close" type="button" aria-label="Cerrar" onClick={() => ref.current.close()}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
      <div className="dlg">
        <div className="media" style={{ "--tint": tone }}>
          <ProductVisual product={p} tone={tone} />
        </div>
        <div className="dlg-body">
          <span className="maker">{p.marca} · {p.categoria}</span>
          <h2>{p.nombre}</h2>
          <Price product={p} />
          <p>{p.descripcion}</p>
          {p.tonos.length > 1 && (
            <div>
              <div className="maker" style={{ marginBottom: 8 }}>Tono {toneIdx} de {p.tonos.length}</div>
              <div className="shades">
                {p.tonos.map((t, i) => (
                  <button key={t} type="button" style={{ background: t }} aria-label={`Tono ${i + 1}`} aria-pressed={t === tone} onClick={() => setTone(t)} />
                ))}
              </div>
            </div>
          )}
          <dl className="specs">
            <dt>Código</dt><dd>{p.codigo}</dd>
            {p.contenido && <><dt>Contenido</dt><dd>{p.contenido}</dd></>}
            {p.stock != null && <><dt>Stock</dt><dd><StockText stock={p.stock} /></dd></>}
          </dl>
          <div className="cta">
            <a className="btn primary" href={`https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z" /></svg>
              Consultar por WhatsApp
            </a>
            <button className="btn" type="button" onClick={copyCode}>{copyLabel}</button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
