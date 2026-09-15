import * as EmbedsWorker from '../EmbedsWorker/EmbedsWorker.js'

// Navigation can finish while Chromium still holds the previous page's paint and drops input.
// A second frame lets the first rendering update complete before the workflow sends a key.
const waitForFrame = `new Promise((resolve, reject) => {
  let firstFrame;
  let secondFrame;
  const timeout = setTimeout(() => {
    cancelAnimationFrame(firstFrame);
    cancelAnimationFrame(secondFrame);
    reject(new Error('The workflow browser tab did not become ready for input'));
  }, 5000);
  firstFrame = requestAnimationFrame(() => {
    secondFrame = requestAnimationFrame(() => {
      clearTimeout(timeout);
      resolve();
    });
  });
})`

export const waitForBrowserFrame = async (browserViewId) => {
  await EmbedsWorker.invoke('ElectronWebContentsView.insertJavaScript', browserViewId, waitForFrame)
}
