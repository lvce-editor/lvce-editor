import * as DecorationClassName from '../DecorationClassName/DecorationClassName.js'
import * as DecorationType from '../DecorationType/DecorationType.js'

export const getDecorationClassName = (type) => {
  switch (type) {
    case DecorationType.Link:
      return DecorationClassName.Link
    case DecorationType.Ts2816:
    case DecorationType.Ts2817:
    case DecorationType.Ts2824:
    case DecorationType.Ts2825:
    case DecorationType.Ts2856:
    case DecorationType.Ts2857:
    case DecorationType.Ts3072:
    case DecorationType.Ts3073:
    case DecorationType.Ts3077:
    case DecorationType.Ts3088:
      return DecorationClassName.Function
    case DecorationType.Ts1792:
    case DecorationType.Ts1793:
      return DecorationClassName.Parameter
    case DecorationType.Ts512:
    case DecorationType.Ts513:
    case DecorationType.Ts769:
    case DecorationType.Ts1024:
    case DecorationType.Ts1536:
    case DecorationType.Ts1537:
    case DecorationType.Ts1544:
    case DecorationType.Ts1545:
      return DecorationClassName.Type
    case DecorationType.Ts2048:
    case DecorationType.Ts2049:
    case DecorationType.Ts2056:
    case DecorationType.Ts2057:
    case DecorationType.Ts2064:
    case DecorationType.Ts2080:
    case DecorationType.Ts2081:
    case DecorationType.Ts2088:
    case DecorationType.Ts2089:
    case DecorationType.Ts2313:
    case DecorationType.Ts2560:
    case DecorationType.Ts2561:
    case DecorationType.Ts2569:
    case DecorationType.Ts2584:
      return DecorationClassName.VariableName
    case DecorationType.Ts256:
    case DecorationType.Ts257:
    case DecorationType.Ts272:
      return DecorationClassName.Class
    default:
      return `Unknown-${type}`
  }
}
