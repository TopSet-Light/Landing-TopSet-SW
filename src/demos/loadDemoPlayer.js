let playerPromise;

export default function loadDemoPlayer() {
  playerPromise ??= import('./DemoPlayer.jsx').catch((error) => {
    playerPromise = undefined;
    throw error;
  });
  return playerPromise;
}
