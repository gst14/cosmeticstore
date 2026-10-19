const RIBBON = ["#9E2B3F", "#C2525E", "#E7A3A8", "#E3B796", "#A97A58"];

export default function Intro({ notice }) {
  return (
    <section className="wrap intro">
      <div>
        <div className="eyebrow">Catálogo · Primavera 2026</div>
        <h1>Tu rutina, <em>a tu tono</em></h1>
        <p>Maquillaje, skincare y fragancias. Elegí tu producto y consultanos por WhatsApp: te asesoramos con el tono y la disponibilidad.</p>
        {notice && <div className="notice">{notice}</div>}
      </div>
      <div className="ribbon" aria-hidden="true">
        {RIBBON.map((c) => <i key={c} style={{ background: c }} />)}
      </div>
    </section>
  );
}
