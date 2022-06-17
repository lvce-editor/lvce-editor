export const supported = () => {
  return 'Segmenter' in Intl
}

export const create = () => {
  // @ts-ignore
  const segmenter = new Intl.Segmenter()
  return {
    at(line, index) {
      const segments = segmenter.segment(line)
      return segments.containing(index)
    },
    visualIndex(line, index) {
      const segments = segmenter.segment(line)
      let currentVisualIndex = 0
      for (const segment of segments) {
        if (segment.index >= index) {
          return currentVisualIndex
        }
        currentVisualIndex++
      }
      return currentVisualIndex
    },
    modelIndex(line, visualIndex) {
      const segments = segmenter.segment(line)
      let currentVisualIndex = 0
      for (const segment of segments) {
        if (currentVisualIndex >= visualIndex) {
          return segment.index
        }
        console.log({ segment })
        currentVisualIndex++
      }
      return line.length
    },
  }
}
