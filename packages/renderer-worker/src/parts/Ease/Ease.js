export const linear = (t, b, c, d) => {
  return (c * t) / d + b
}

export const inQuad = (t, b, c, d) => {
  return c * (t /= d) * t + b
}
export const outQuad = (t, b, c, d) => {
  return -c * (t /= d) * (t - 2) + b
}

export const inOutQuad = (t, b, c, d) => {
  if ((t /= d / 2) < 1) return (c / 2) * t * t + b
  return (-c / 2) * (--t * (t - 2) - 1) + b
}

export const inSine = (t, b, c, d) => {
  return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b
}

export const outSine = (t, b, c, d) => {
  return c * Math.sin((t / d) * (Math.PI / 2)) + b
}

export const outExpo = (t, b, c, d) => {
  return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b
}

// TODO implement cubic bezier

// outSine(0, 0, 0, 0) //?

const pow = (x, y) => {
  return x ** y
}

function easeOutCirc(x) {
  return Math.sqrt(1 - pow(x - 1, 2))
}

easeOutCirc(0.5) //?
easeOutCirc(0.8) //?
