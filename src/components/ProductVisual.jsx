import { useState } from "react";
import { norm } from "../lib/catalog.js";

/* Ilustraciones de producto (si no hay foto, o si la foto falla) */
function kindOf(p) {
  const n = norm(p.nombre + " " + p.categoria);
  if (/labial/.test(n)) return "lipstick";
  if (/gloss|balsamo/.test(n)) return "gloss";
  if (/pestanas|delineador|mascara de/.test(n)) return "wand";
  if (/esmalte/.test(n)) return "nail";
  if (/rubor|polvo|paleta|sombra/.test(n)) return "compact";
  if (/parfum|perfume|mist|colonia|fragancia/.test(n)) return "perfume";
  if (/serum|aceite|base|iluminador|quitaesmalte/.test(n)) return "dropper";
  return "jar";
}

const hl = { fill: "#fff", opacity: 0.28 };

function shape(kind, p, c) {
  switch (kind) {
    case "lipstick":
      return <>
        <rect x="76" y="138" width="48" height="92" rx="5" className="pd" />
        <rect x="79" y="114" width="42" height="28" rx="3" className="pg" />
        <path d="M84 116V66l32-24v74z" fill={c} />
        <path d="M88 112V70l6-4v46z" {...hl} />
      </>;
    case "gloss":
      return <>
        <rect x="80" y="86" width="40" height="144" rx="20" fill={c} />
        <rect x="86" y="98" width="7" height="110" rx="3.5" {...hl} />
        <rect x="82" y="28" width="36" height="64" rx="8" className="pd" />
        <rect x="82" y="84" width="36" height="8" className="pg" />
      </>;
    case "wand":
      return <>
        <rect x="84" y="96" width="32" height="134" rx="16" className="pd" />
        <rect x="84" y="96" width="32" height="10" className="pg" />
        <rect x="90" y="26" width="20" height="74" rx="6" className="pd" />
        <rect x="91" y="110" width="5" height="100" rx="2.5" fill="#fff" opacity=".12" />
      </>;
    case "nail":
      return <>
        <rect x="66" y="128" width="68" height="102" rx="14" fill={c} />
        <rect x="73" y="138" width="9" height="78" rx="4.5" {...hl} />
        <rect x="84" y="40" width="32" height="92" rx="6" className="pd" />
      </>;
    case "compact":
      return <>
        <circle cx="100" cy="150" r="74" className="pd" />
        <circle cx="100" cy="150" r="74" fill="none" className="pgs" strokeWidth="3" />
        {p.tonos.length > 2
          ? p.tonos.slice(0, 4).map((t, i) => (
              <rect key={i} x={i % 2 ? 102 : 46} y={i < 2 ? 96 : 152} width="52" height="52" rx="8" fill={t} />
            ))
          : <>
              <circle cx="100" cy="150" r="58" fill={c} />
              <ellipse cx="78" cy="126" rx="22" ry="12" {...hl} transform="rotate(-30 78 126)" />
            </>}
      </>;
    case "perfume":
      return <>
        <rect x="56" y="106" width="88" height="124" rx="16" fill={c} opacity=".9" />
        <rect x="66" y="118" width="12" height="96" rx="6" {...hl} />
        <rect x="88" y="88" width="24" height="22" className="pg" />
        <rect x="78" y="40" width="44" height="52" rx="6" className="pg" />
        <rect x="74" y="160" width="52" height="26" rx="2" fill="#fff" opacity=".55" />
      </>;
    case "dropper":
      return <>
        <rect x="62" y="116" width="76" height="114" rx="12" fill={c} opacity=".92" />
        <rect x="70" y="126" width="10" height="90" rx="5" {...hl} />
        <rect x="84" y="94" width="32" height="26" className="pg" />
        <rect x="88" y="36" width="24" height="62" rx="12" className="pd" />
      </>;
    default:
      return <>
        <rect x="48" y="146" width="104" height="84" rx="14" fill={c} />
        <rect x="58" y="156" width="10" height="62" rx="5" {...hl} />
        <rect x="42" y="112" width="116" height="40" rx="10" className="pg" />
        <rect x="42" y="140" width="116" height="6" className="pd" opacity=".25" />
      </>;
  }
}

export function ProductArt({ product, tone }) {
  return (
    <svg viewBox="0 0 200 250" role="img" aria-label={product.nombre}>
      <ellipse cx="100" cy="232" rx="58" ry="7" fill="var(--shade)" />
      {shape(kindOf(product), product, tone || product.tonos[0])}
    </svg>
  );
}

export default function ProductVisual({ product, tone }) {
  const [broken, setBroken] = useState(false);
  if (product.imagen && !broken) {
    return <img src={product.imagen} alt={product.nombre} loading="lazy" onError={() => setBroken(true)} />;
  }
  return <ProductArt product={product} tone={tone} />;
}
