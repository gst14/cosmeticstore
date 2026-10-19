export default function Header({ storeName, query, onQueryChange }) {
  return (
    <header className="top">
      <div className="wrap">
        <a className="brand" href="#">
          <b>{storeName}</b><small>Cosmética &amp; Skincare</small>
        </a>
        <label className="search" htmlFor="q">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input
            id="q" type="search" placeholder="Buscar labial, sérum, código…" autoComplete="off"
            value={query} onChange={(e) => onQueryChange(e.target.value)}
          />
        </label>
      </div>
    </header>
  );
}
