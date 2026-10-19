export default function Categories({ categories, active, onSelect }) {
  return (
    <div className="wrap">
      <nav className="cats" aria-label="Categorías">
        {categories.map(({ name, count }) => (
          <button key={name} className="chip" type="button" aria-pressed={active === name} onClick={() => onSelect(name)}>
            {name}<span>{count}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
