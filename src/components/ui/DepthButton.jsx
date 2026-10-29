/** Render the shared CTA as a link when a destination is provided. */
export default function DepthButton({ href, children, className = '', ...props }) {
  const Element = href ? 'a' : 'button';
  return (
    <Element
      {...props}
      {...(href
        ? {
            href,
          }
        : {
            type: 'button',
          })}
      className={`depth-button ${className}`}
    >
      {children}
    </Element>
  );
}
