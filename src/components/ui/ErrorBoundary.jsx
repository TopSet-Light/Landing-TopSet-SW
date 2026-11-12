import { Component } from 'react';

/**
 * Keeps a failure inside one part of the page (a lazy chunk that did not
 * download, or a render error) from unmounting the whole landing.
 * `fallback` is rendered instead of the children once something fails.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
