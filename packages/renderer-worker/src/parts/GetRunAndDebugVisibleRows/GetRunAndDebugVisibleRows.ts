import * as DebugItemFlags from '../DebugItemFlags/DebugItemFlags.js'
import type { DebugRow } from '../DebugRow/DebugRow.ts'
import * as DebugScopeChainType from '../DebugScopeChainType/DebugScopeChainType.js'
import * as DebugStrings from '../DebugStrings/DebugStrings.js'
import * as GetVisibleScopeItems from '../GetVisibleScopeItems/GetVisibleScopeItems.js'
import * as DebugRowType from '../DebugRowType/DebugRowType.ts'

const getRunAndDebugVisibleRowsWatch = (state): readonly DebugRow[] => {
  const { watchExpanded } = state
  return [
    {
      type: DebugRowType.SectionHeading,
      text: DebugStrings.watch(),
      expanded: watchExpanded,
      key: '',
      value: '',
      indent: 0,
      valueType: '',
    },
  ]
}

const getRunAndDebugVisibleRowsBreakPoints = (state): readonly DebugRow[] => {
  const { breakPointsExpanded } = state
  return [
    {
      type: DebugRowType.SectionHeading,
      text: DebugStrings.breakPoints(),
      expanded: breakPointsExpanded,
      key: '',
      value: '',
      indent: 0,
      valueType: '',
    },
  ]
}

const getScopeThisRows = (scope): readonly DebugRow[] => {
  const { indent, key, value, valueType } = scope
  return [
    {
      type: DebugRowType.Value,
      text: '',
      expanded: false,
      key,
      value,
      indent,
      valueType,
    },
  ]
}

const getScopeExceptionRows = (scope): readonly DebugRow[] => {
  const { key, value } = scope
  return [
    {
      type: DebugRowType.Exception,
      text: '',
      expanded: false,
      key,
      value,
      indent: 0,
      valueType: '',
    },
  ]
}

const getScopeScopeRows = (scope): readonly DebugRow[] => {
  const { key, flags } = scope
  return [
    {
      type: DebugRowType.Scope,
      text: '',
      expanded: Boolean(flags & DebugItemFlags.Expanded),
      key,
      value: '',
      indent: 0,
      valueType: '',
    },
  ]
}

const getScopePropertyRows = (scope): readonly DebugRow[] => {
  const { indent, key, value, valueType, flags } = scope
  return [
    {
      type: DebugRowType.Property,
      text: '',
      expanded: Boolean(flags & DebugItemFlags.Expanded),
      key,
      value,
      indent,
      valueType,
    },
  ]
}

const getNoopRows = () => {
  return []
}

const getScopeRenderer = (type) => {
  switch (type) {
    case DebugScopeChainType.This:
      return getScopeThisRows
    case DebugScopeChainType.Exception:
      return getScopeExceptionRows
    case DebugScopeChainType.Scope:
      return getScopeScopeRows
    case DebugScopeChainType.Property:
      return getScopePropertyRows
    default:
      return getNoopRows
  }
}

const getRunAndDebugVisibleRowsScope = (state): readonly DebugRow[] => {
  const rows: DebugRow[] = []
  const { scopeChain, scopeExpanded, expandedIds, scopeFocusedIndex } = state
  if (scopeExpanded) {
    rows.push({
      type: DebugRowType.SectionHeading,
      text: DebugStrings.scope(),
      expanded: true,
      key: '',
      value: '',
      indent: 0,
      valueType: '',
    })
    if (scopeChain.length === 0) {
      rows.push({
        type: DebugRowType.Message,
        text: DebugStrings.notPaused(),
        expanded: false,
        key: '',
        value: '',
        indent: 0,
        valueType: '',
      })
    } else {
      const visible = GetVisibleScopeItems.getVisibleScopeItems(scopeChain, expandedIds, scopeFocusedIndex)
      for (const scope of visible) {
        const renderer = getScopeRenderer(scope.type)
        rows.push(...renderer(scope))
      }
    }
  } else {
    rows.push({
      type: DebugRowType.SectionHeading,
      text: DebugStrings.scope(),
      expanded: false,
      key: '',
      value: '',
      indent: 0,
      valueType: '',
    })
  }
  return rows
}

const getRunAndDebugVisibleRowsCallStack = (state): readonly DebugRow[] => {
  const { callStack, callStackExpanded } = state
  const rows: DebugRow[] = []
  if (callStackExpanded) {
    rows.push({
      type: DebugRowType.SectionHeading,
      text: DebugStrings.callStack(),
      expanded: true,
      key: '',
      value: '',
      indent: 0,
      valueType: '',
    })
    if (callStack.length === 0) {
      rows.push({
        type: DebugRowType.Message,
        text: DebugStrings.notPaused(),
        expanded: false,
        key: '',
        value: '',
        indent: 0,
        valueType: '',
      })
    } else {
      for (const item of callStack) {
        rows.push({
          type: DebugRowType.CallStack,
          text: item.functionName,
          expanded: false,
          key: '',
          value: '',
          indent: 0,
          valueType: '',
        })
      }
    }
  } else {
    rows.push({
      type: DebugRowType.SectionHeading,
      text: DebugStrings.callStack(),
      expanded: false,
      key: '',
      value: '',
      indent: 0,
      valueType: '',
    })
  }
  return rows
}

export const getRunAndDebugVisibleRows = (state) => {
  const rows = [
    ...getRunAndDebugVisibleRowsWatch(state),
    ...getRunAndDebugVisibleRowsBreakPoints(state),
    ...getRunAndDebugVisibleRowsScope(state),
    ...getRunAndDebugVisibleRowsCallStack(state),
  ]
  return rows
}
