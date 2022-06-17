import delay from "./yoctodelay.js";
async function pMinDelay(promise, minimumDelay, {delayRejection = true} = {}) {
  await Promise[delayRejection ? "allSettled" : "all"]([
    promise,
    delay(minimumDelay)
  ]);
  return promise;
}
export default pMinDelay;
