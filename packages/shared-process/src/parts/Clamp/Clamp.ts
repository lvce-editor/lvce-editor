export const clamp = (number_: any, min: any, max: any): any => {
  return Math.min(Math.max(number_, min), max)
}
