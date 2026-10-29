import Welcome from './pages/Welcome.jsx';
import useWelcomeTransition from './hooks/useWelcomeTransition.js';

export default function App() {
  const { Home, entered, launching, error, enter, preloadHome, completeFlight } =
    useWelcomeTransition();
  if (entered && Home) return <Home />;
  return (
    <Welcome
      launching={launching}
      error={error}
      onEnter={enter}
      onIntent={preloadHome}
      onFlightEnd={completeFlight}
    />
  );
}
