// copied from https://github.com/mozilla/pdf.js/issues/10319#issuecomment-1074078410
export const document = {
  fonts: self.fonts,
  createElement: (name) => {
    if (name == 'canvas') {
      return new OffscreenCanvas(1, 1)
    }
    return null
  },
}
