import demos from './demoCatalog.js';

export default function DemoPicker({ selectedId, onSelect }) {
  return (
    <div className="demo-picker" role="tablist" aria-label="Elegí qué sistema probar">
      {demos.map((item, index) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          id={`demo-tab-${item.id}`}
          aria-selected={item.id === selectedId}
          aria-controls="demo-panel"
          className={`demo-pick${item.id === selectedId ? ' is-active' : ''}`}
          style={{ '--demo-accent': item.accent }}
          onClick={() => onSelect(item.id)}
        >
          <span className="demo-pick-icon material-symbols-outlined" aria-hidden="true">
            {item.icon}
          </span>
          <span className="demo-pick-text">
            <span className="demo-pick-kicker">
              {String(index + 1).padStart(2, '0')} · {item.label}
            </span>
            <strong>{item.name}</strong>
            <span className="demo-pick-summary">{item.summary}</span>
          </span>
          <span className="demo-pick-state" aria-hidden="true">
            {item.id === selectedId ? 'En pantalla' : 'Ver demo →'}
          </span>
        </button>
      ))}
    </div>
  );
}
