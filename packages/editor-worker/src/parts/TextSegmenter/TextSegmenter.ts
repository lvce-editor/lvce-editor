export const supported = () => {
  return 'Segmenter' in Intl
}

export const create = () => {
  // @ts-ignore
  const segmenter = new Intl.Segmenter()
  return {
    at(line: string, index: number) {
      const segments = segmenter.segment(line)
      return segments.containing(index)
    },
    visualIndex(line: string, index: number) {
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
    modelIndex(line: string, visualIndex: number) {
      const segments = segmenter.segment(line)
      let currentVisualIndex = 0
      for (const segment of segments) {
        if (currentVisualIndex >= visualIndex) {
          return segment.index
        }
        currentVisualIndex++
      }
      return line.length
    },
    getSegments(line: string) {
      return segmenter.segment(line)
    },
  }
}
