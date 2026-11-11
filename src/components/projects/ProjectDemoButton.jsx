/**
 * Demo/live-site CTA shared by every project card. While `demoUrl` is empty the
 * card shows an honest pending state instead of a link that goes nowhere.
 */
export default function ProjectDemoButton({ project, className = '' }) {
  const demoUrl = project.demoUrl?.trim();
  const classes = `project-demo-button${demoUrl ? '' : ' is-pending'}${
    className ? ` ${className}` : ''
  }`;

  if (!demoUrl) {
    return (
      <span className={classes} aria-disabled="true" title="Todavía no publicamos esta demo">
        <span>Demo próximamente</span>
        <span aria-hidden="true">↗</span>
      </span>
    );
  }

  return (
    <a
      className={classes}
      href={demoUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver demo de ${project.name}`}
    >
      <span>Ver demo</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
