const normalizeLine = (line) => {
  if (line.startsWith("Error: ")) {
    return line.slice(`Error: `.length);
  }
  if (line.startsWith("VError: ")) {
    return line.slice(`VError: `.length);
  }
  return line;
};
const getCombinedMessage = (error, message) => {
  const stringifiedError = normalizeLine(`${error}`);
  if (message) {
    return `${message}: ${stringifiedError}`;
  }
  return stringifiedError;
};
const NewLine = "\n";
const getNewLineIndex = (string, startIndex = void 0) => {
  return string.indexOf(NewLine, startIndex);
};
const mergeStacks = (parent, child) => {
  if (!child) {
    return parent;
  }
  const parentNewLineIndex = getNewLineIndex(parent);
  const childNewLineIndex = getNewLineIndex(child);
  if (childNewLineIndex === -1) {
    return parent;
  }
  const parentFirstLine = parent.slice(0, parentNewLineIndex);
  const childRest = child.slice(childNewLineIndex);
  const childFirstLine = normalizeLine(child.slice(0, childNewLineIndex));
  if (parentFirstLine.includes(childFirstLine)) {
    return parentFirstLine + childRest;
  }
  return child;
};
class VError extends Error {
  constructor(error, message) {
    const combinedMessage = getCombinedMessage(error, message);
    super(combinedMessage);
    this.name = "VError";
    if (error instanceof Error) {
      this.stack = mergeStacks(this.stack, error.stack);
    }
    if (error.codeFrame) {
      this.codeFrame = error.codeFrame;
    }
    if (error.code) {
      this.code = error.code;
    }
  }
}
export {VError};
export default null;
