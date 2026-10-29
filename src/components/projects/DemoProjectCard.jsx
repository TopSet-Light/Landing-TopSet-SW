export default function DemoProjectCard({ project, index }) {
  const number = String(index + 3).padStart(2, '0');
  return (
    <article
      className="demo-project-card"
      id={`demo-${project.id}`}
      aria-labelledby={`demo-title-${project.id}`}
    >
      <div className="demo-project-copy">
        <div className="demo-project-label">
          <span>{`${number} / ${project.name}`}</span>
          <span className="demo-badge">DEMO</span>
        </div>
        <div>
          <p className="demo-project-category">{project.category}</p>
          <h3 id={`demo-title-${project.id}`}>{project.title}</h3>
          <p className="demo-project-description">{project.description}</p>
        </div>
        <ul className="demo-project-features">
          {project.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <a className="demo-project-contact" href="#contacto">
          Quiero un proyecto así<span aria-hidden={true}>↗</span>
        </a>
      </div>
      <div className={`demo-project-art demo-theme-${project.theme}`} aria-hidden={true}>
        {project.image && (
          <img
            className="demo-project-photo"
            src={project.image}
            alt=""
            loading="lazy"
            decoding="async"
            width={1000}
            height={800}
          />
        )}
        <div className="demo-browser">
          <div className="demo-browser-bar">
            <i />
            <i />
            <i />
            <span>Vista conceptual</span>
          </div>
          <div className="demo-browser-body">
            <span className="demo-app-brand">{project.label}</span>
            <div className="demo-app-heading">{project.headline}</div>
            <div className="demo-app-panels">
              {project.panels.map((panel, panelIndex) => (
                <div className="demo-app-panel" key={panel}>
                  <span className="material-symbols-outlined">{project.icon}</span>
                  <span>{panel}</span>
                  <div
                    className="demo-app-line"
                    style={{
                      width: `${50 + panelIndex * 15}%`,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="demo-app-footer">
              PROTOTIPO / DATOS DE EJEMPLO<span>↗</span>
            </div>
          </div>
        </div>
        <span className="demo-project-number">{number}</span>
      </div>
    </article>
  );
}
