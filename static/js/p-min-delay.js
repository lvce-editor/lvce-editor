import delay from "./yoctodelay.js";
async function pMinDelay(promise, minimumDelay, {delayRejection = true} = {}) {
  const delayPromise = delay(minimumDelay);
  await (delayRejection ? delayPromise : Promise.all([promise, delayPromise]));
  return promise;
}
export default pMinDelay;
