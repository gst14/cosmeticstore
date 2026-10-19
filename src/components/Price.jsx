import { money } from "../lib/catalog.js";

export default function Price({ product: p }) {
  if (p.precio == null) return <div className="price"><b>Consultar</b></div>;
  return p.oferta ? (
    <div className="price"><b className="now">{money.format(p.oferta)}</b><s>{money.format(p.precio)}</s></div>
  ) : (
    <div className="price"><b>{money.format(p.precio)}</b></div>
  );
}
