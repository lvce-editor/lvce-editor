exports.clamp = (number_, min, max) => {
  return Math.min(Math.max(number_, min), max)
}
