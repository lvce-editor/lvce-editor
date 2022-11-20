export const create = (fnString) => {
  return new Function('return ' + fnString)()
}
