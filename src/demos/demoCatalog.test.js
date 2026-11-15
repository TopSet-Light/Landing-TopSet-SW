import { expect, it } from 'vitest';
import tallerDemo from './taller/tallerDemo.js';
import turneroDemo from './turnero/turneroDemo.js';

it.each([tallerDemo, turneroDemo])('reserves the initial toolbar content of $id', (demo) => {
  expect(demo.steps[0]).toMatchObject(demo.intro);
  expect(demo.previewStepCount).toBe(demo.steps.length);
  expect(demo.compactPreviewStepCount).toBe(demo.steps.filter((step) => !step.desktopOnly).length);
});
