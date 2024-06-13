export const state = {
  /**
   * @type {OffscreenCanvasRenderingContext2D|undefined|null}
   */
  ctx: undefined,
}

/**
 * @param {()=>OffscreenCanvasRenderingContext2D} createCtx
 * @returns {OffscreenCanvasRenderingContext2D}
 */
export const getOrCreate = (createCtx) => {
  if (state.ctx) {
    return state.ctx
  }
  state.ctx = createCtx()
  return state.ctx
}
