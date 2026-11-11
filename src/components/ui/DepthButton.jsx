/** Render the shared CTA as a link when a destination is provided. */
export default function DepthButton({ href, children, className = '', type = 'button', ...props }) {
  const Element = href ? 'a' : 'button';
  return (
    <Element
      {...props}
      {...(href ? { href } : { type })}
      className={`depth-button group ${className}`.trim()}
    >
      {children}
    </Element>
  );
}
