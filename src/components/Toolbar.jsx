export default function Toolbar({ count, activeCount, tags, onRemoveTag, sort, onSortChange, view, onViewChange, onOpenFilters }) {
  return (
    <div className="toolbar">
      <button className="fbtn" type="button" onClick={onOpenFilters}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
        Filtros {activeCount > 0 && <span className="dot">{activeCount}</span>}
      </button>
      <div className="count"><b>{count}</b> {count === 1 ? "producto" : "productos"}</div>
      <div className="right">
        <select className="select" aria-label="Ordenar" value={sort} onChange={(e) => onSortChange(e.target.value)}>
          <option value="destacados">Destacados</option>
          <option value="precio-asc">Menor precio</option>
          <option value="precio-desc">Mayor precio</option>
          <option value="nombre">Nombre A–Z</option>
        </select>
        <div className="views" role="group" aria-label="Vista">
          <button type="button" aria-label="Vista en grilla" aria-pressed={view === "grid"} onClick={() => onViewChange("grid")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></svg>
          </button>
          <button type="button" aria-label="Vista en lista" aria-pressed={view === "list"} onClick={() => onViewChange("list")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="4" rx="2" /><rect x="3" y="10" width="18" height="4" rx="2" /><rect x="3" y="16" width="18" height="4" rx="2" /></svg>
          </button>
        </div>
      </div>
      {tags.length > 0 && (
        <div className="active-tags">
          {tags.map(({ key, label }) => (
            <button key={key} className="tag" type="button" onClick={() => onRemoveTag(key)}>
              {label} <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
