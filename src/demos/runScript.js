/**
 * Tour scripts are plain arrays of operations:
 *   { act: action | action[] }           dispatch right away
 *   { wait: ms }                         pause
 *   { click: target, act? }              move the cursor to [data-tour=target], press, dispatch
 *   { type: target, field, text }        click the field and type `text` into state[field]
 * With `instant` the script only applies its state changes (used to fast-forward).
 */
const MOVE_MS = 750;
const PRESS_MS = 260;
const KEY_MS = 42;

const asList = (action) => (Array.isArray(action) ? action : action ? [action] : []);

export function estimateStep(script) {
  return script.reduce((total, op) => {
    if (op.wait) return total + op.wait;
    if (op.type) return total + MOVE_MS + PRESS_MS + op.text.length * KEY_MS + 200;
    if (op.click) return total + MOVE_MS + PRESS_MS + 200;
    return total;
  }, 0);
}

export async function runScript(script, { dispatch, instant, controller, moveTo, press }) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const alive = () => !controller?.cancelled;

  for (const op of script) {
    if (instant) {
      if (op.type) dispatch({ type: 'SET_FIELD', field: op.field, value: op.text });
      asList(op.act).forEach(dispatch);
      continue;
    }
    if (!alive()) return false;
    if (op.wait) {
      await sleep(op.wait);
      continue;
    }
    if (op.click || op.type) {
      const target = op.click || op.type;
      // Let the screen render before measuring where the target is.
      await sleep(60);
      if (!alive()) return false;
      if (moveTo(target)) await sleep(MOVE_MS);
      if (!alive()) return false;
      press(true);
      await sleep(PRESS_MS);
      press(false);
      if (!alive()) return false;
      if (op.type) {
        for (let index = 1; index <= op.text.length; index += 1) {
          dispatch({ type: 'SET_FIELD', field: op.field, value: op.text.slice(0, index) });
          await sleep(KEY_MS);
          if (!alive()) return false;
        }
      }
      asList(op.act).forEach(dispatch);
      await sleep(200);
      continue;
    }
    asList(op.act).forEach(dispatch);
  }
  return alive();
}
