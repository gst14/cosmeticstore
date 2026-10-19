import { useEffect, useMemo, useState } from "react";
import { CONFIG } from "./config.js";
import { applyFilters, loadProducts, money, sortProducts } from "./lib/catalog.js";
import sampleCsv from "./data/sample.csv?raw";
import Header from "./components/Header.jsx";
import Intro from "./components/Intro.jsx";
import Categories from "./components/Categories.jsx";
import Filters from "./components/Filters.jsx";
import Toolbar from "./components/Toolbar.jsx";
import ProductCard from "./components/ProductCard.jsx";
import ProductDetail from "./components/ProductDetail.jsx";

const EMPTY_FILTERS = { q: "", cat: "Todo", brands: new Set(), max: null, sale: false, stock: false, nuevo: false };
const TOGGLE_LABELS = { sale: "Ofertas", stock: "Con stock", nuevo: "Novedades" };

function readView() {
  try { return localStorage.getItem("rubor-view") || "grid"; } catch { return "grid"; }
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [pmax, setPmax] = useState(100000);
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState("destacados");
  const [view, setView] = useState(readView);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const update = (patch) => setFilters((f) => ({ ...f, ...patch }));

  useEffect(() => {
    loadProducts(sampleCsv).then(({ products, pmax, failed }) => {
      setProducts(products);
      setPmax(pmax);
      if (failed) setNotice("No pudimos cargar el catálogo actualizado. Mostramos una versión de ejemplo.");
    });
  }, []);

  // Búsqueda con pequeño debounce, como en la versión original
  useEffect(() => {
    const t = setTimeout(() => update({ q: query.trim() }), 120);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setFiltersOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const changeView = (v) => {
    setView(v);
    try { localStorage.setItem("rubor-view", v); } catch {}
  };

  const toggleBrand = (b) =>
    setFilters((f) => {
      const brands = new Set(f.brands);
      brands.has(b) ? brands.delete(b) : brands.add(b);
      return { ...f, brands };
    });

  const resetAll = () => { setQuery(""); setFilters({ ...EMPTY_FILTERS, brands: new Set() }); };

  const list = useMemo(() => sortProducts(applyFilters(products, filters), sort), [products, filters, sort]);

  const categories = useMemo(() => {
    const base = applyFilters(products, filters, "cat");
    return ["Todo", ...new Set(products.map((p) => p.categoria))].map((name) => ({
      name, count: name === "Todo" ? base.length : base.filter((p) => p.categoria === name).length,
    }));
  }, [products, filters]);

  const brands = useMemo(() => {
    const base = applyFilters(products, filters, "brand");
    return [...new Set(products.map((p) => p.marca).filter(Boolean))].sort().map((name) => ({
      name, count: base.filter((p) => p.marca === name).length,
    }));
  }, [products, filters]);

  const hasMax = filters.max != null && filters.max < pmax;
  const tags = [
    filters.q && { key: "q", label: `“${filters.q}”` },
    ...[...filters.brands].map((b) => ({ key: "brand:" + b, label: b })),
    hasMax && { key: "max", label: "Hasta " + money.format(filters.max) },
    ...Object.keys(TOGGLE_LABELS).filter((k) => filters[k]).map((k) => ({ key: k, label: TOGGLE_LABELS[k] })),
  ].filter(Boolean);
  const activeCount = filters.brands.size + hasMax + filters.sale + filters.stock + filters.nuevo;

  const removeTag = (key) => {
    if (key === "q") { setQuery(""); update({ q: "" }); }
    else if (key.startsWith("brand:")) toggleBrand(key.slice(6));
    else if (key === "max") update({ max: null });
    else update({ [key]: false });
  };

  return (
    <>
      <Header storeName={CONFIG.STORE_NAME} query={query} onQueryChange={setQuery} />

      <main>
        <Intro notice={notice} />
        <Categories categories={categories} active={filters.cat} onSelect={(cat) => update({ cat })} />

        <div className="wrap main">
          <Filters
            open={filtersOpen} onClose={() => setFiltersOpen(false)}
            brands={brands} filters={filters} pmax={pmax}
            onChange={update} onToggleBrand={toggleBrand} onReset={resetAll}
          />
          <section>
            <Toolbar
              count={list.length} activeCount={activeCount} tags={tags} onRemoveTag={removeTag}
              sort={sort} onSortChange={setSort} view={view} onViewChange={changeView}
              onOpenFilters={() => setFiltersOpen(true)}
            />
            <div className={"grid" + (view === "list" ? " list" : "")}>
              {list.length ? (
                list.map((p, i) => <ProductCard key={p.codigo} product={p} index={i} onOpen={setSelected} />)
              ) : (
                <div className="empty">
                  <h3>Sin resultados</h3>
                  <p>No encontramos productos con esos filtros.</p>
                  <button className="btn" type="button" onClick={resetAll}>Ver todo el catálogo</button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer>
        <div className="wrap">
          <span><b>{CONFIG.STORE_NAME}</b> · Cosmética &amp; Skincare</span>
          <span>Precios en pesos argentinos, sujetos a cambios sin previo aviso.</span>
        </div>
      </footer>

      {selected && <ProductDetail key={selected.codigo} product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
