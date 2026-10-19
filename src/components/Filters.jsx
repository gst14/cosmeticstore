import { money } from "../lib/catalog.js";

const SWITCHES = [
  ["sale", "onlySale", "Solo ofertas"],
  ["stock", "onlyStock", "Solo con stock"],
  ["nuevo", "onlyNew", "Novedades"],
];

export default function Filters({ open, onClose, brands, filters, pmax, onChange, onToggleBrand, onReset }) {
  return (
    <>
      <div className={"scrim" + (open ? " open" : "")} onClick={onClose} />
      <aside className={"filters" + (open ? " open" : "")} aria-label="Filtros">
        <div className="fgroup">
          <h3>Marca</h3>
          <div>
            {brands.map(({ name, count }, i) => (
              <label key={name} className="check" htmlFor={"b" + i}>
                <input id={"b" + i} type="checkbox" checked={filters.brands.has(name)} onChange={() => onToggleBrand(name)} />
                {name}<span className="n">{count}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="fgroup">
          <h3>Precio máximo</h3>
          <input
            className="range" id="maxPrice" type="range" min="0" max={pmax} step="500"
            value={filters.max ?? pmax}
            onChange={(e) => { const v = +e.target.value; onChange({ max: v >= pmax ? null : v }); }}
          />
          <div className="range-val">
            <span>{money.format(0)}</span>
            <b>{filters.max == null || filters.max >= pmax ? "Sin límite" : money.format(filters.max)}</b>
          </div>
        </div>
        <div className="fgroup">
          <h3>Mostrar</h3>
          {SWITCHES.map(([key, id, label]) => (
            <label key={key} className="switch" htmlFor={id}>
              {label} <input id={id} type="checkbox" checked={filters[key]} onChange={(e) => onChange({ [key]: e.target.checked })} />
            </label>
          ))}
        </div>
        <button className="linkbtn" type="button" onClick={onReset}>Limpiar filtros</button>
      </aside>
    </>
  );
}
