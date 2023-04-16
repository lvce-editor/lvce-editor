export const create = (key, value, unit = '') => {
  return `--${key}: ${value}${unit};`
}
