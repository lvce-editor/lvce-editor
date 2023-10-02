// based on https://github.com/microsoft/vscode/blob/bd782eb059e133d3a20fdb446b8feb0010a278ad/src/vs/base/common/date.ts (License MIT)
import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  OneSecondAgo: '1 second ago',
  SomeSecondsAgo: '{PH1} seconds ago',
  OneMinuteAgo: '1 minute ago',
  SomeMinutesAgo: '{PH1} minutes ago',
  OneHourAgo: '1 hour ago',
  SomeHoursAgo: '{PH1} hours ago',
  OneDayAgo: '1 day ago',
  SomeDaysAgo: '{PH1} days ago',
  OneWeekAgo: '1 week ago',
  SomeWeeksAgo: '{PH1} weeks ago',
  OneMonthAgo: '1 month ago',
  SomeMonthsAgo: '{PH1} months ago',
  OneYearAgo: '1 year ago',
  SomeYearsAgo: '{PH1} years ago',
  InOneSecond: 'in 1 second',
  InSomeSeconds: 'in {PH1} seconds',
  InOneMinute: 'in 1 minute',
  InSomeMinutes: 'in {PH1} minutes',
  InOneHour: 'in 1 hour',
  InSomeHours: 'in {PH1} hours',
  InOneDay: 'in 1 day',
  InSomeDays: 'in {PH1} days',
  InOneWeek: 'in 1 week',
  InSomeWeeks: 'in {PH1} weeks',
  InOneMonth: 'in 1 month',
  InSomeMonths: 'in {PH1} months',
  InOneYear: 'in 1 year',
  InSomeYears: 'in {PH1} years',
}

export const oneSecondAgo = () => {
  return I18nString.i18nString(UiStrings.OneSecondAgo)
}

export const someSecondsAgo = (seconds) => {
  return I18nString.i18nString(UiStrings.SomeSecondsAgo, {
    PH1: seconds,
  })
}

export const oneMinuteAgo = () => {
  return I18nString.i18nString(UiStrings.OneMinuteAgo)
}

export const someMinutesAgo = (minutes) => {
  return I18nString.i18nString(UiStrings.SomeMinutesAgo, {
    PH1: minutes,
  })
}

export const oneHourAgo = () => {
  return I18nString.i18nString(UiStrings.OneHourAgo)
}

export const someHoursAgo = (hours) => {
  return I18nString.i18nString(UiStrings.SomeHoursAgo, {
    PH1: hours,
  })
}

export const oneDayAgo = () => {
  return I18nString.i18nString(UiStrings.OneDayAgo)
}

export const someDaysAgo = (days) => {
  return I18nString.i18nString(UiStrings.SomeDaysAgo, {
    PH1: days,
  })
}

export const oneWeekAgo = () => {
  return I18nString.i18nString(UiStrings.OneWeekAgo)
}

export const someWeeksAgo = (weeks) => {
  return I18nString.i18nString(UiStrings.SomeWeeksAgo, {
    PH1: weeks,
  })
}

export const oneMonthAgo = () => {
  return I18nString.i18nString(UiStrings.OneMonthAgo)
}

export const someMonthsAgo = (months) => {
  return I18nString.i18nString(UiStrings.SomeMonthsAgo, {
    PH1: months,
  })
}

export const oneYearAgo = () => {
  return I18nString.i18nString(UiStrings.OneYearAgo)
}

export const someYearsAgo = (years) => {
  return I18nString.i18nString(UiStrings.SomeYearsAgo, {
    PH1: years,
  })
}

export const inOneSecond = () => {
  return I18nString.i18nString(UiStrings.InOneSecond)
}

export const inSomeSeconds = (seconds) => {
  return I18nString.i18nString(UiStrings.InSomeSeconds, {
    PH1: seconds,
  })
}

export const inOneMinute = () => {
  return I18nString.i18nString(UiStrings.InOneMinute)
}

export const inSomeMinutes = (minutes) => {
  return I18nString.i18nString(UiStrings.InSomeMinutes, {
    PH1: minutes,
  })
}

export const inOneHour = () => {
  return I18nString.i18nString(UiStrings.InOneHour)
}

export const inSomeHours = (hours) => {
  return I18nString.i18nString(UiStrings.InSomeHours, {
    PH1: hours,
  })
}

export const inOneDay = () => {
  return I18nString.i18nString(UiStrings.InOneDay)
}

export const inSomeDays = (days) => {
  return I18nString.i18nString(UiStrings.InSomeDays, {
    PH1: days,
  })
}

export const inOneWeek = () => {
  return I18nString.i18nString(UiStrings.InOneWeek)
}

export const inSomeWeeks = (weeks) => {
  return I18nString.i18nString(UiStrings.InSomeWeeks, {
    PH1: weeks,
  })
}

export const inOneMonth = () => {
  return I18nString.i18nString(UiStrings.InOneMonth)
}

export const inSomeMonths = (months) => {
  return I18nString.i18nString(UiStrings.InSomeMonths, {
    PH1: months,
  })
}

export const inOneYear = () => {
  return I18nString.i18nString(UiStrings.InOneYear)
}

export const inSomeYears = (years) => {
  return I18nString.i18nString(UiStrings.InSomeYears, {
    PH1: years,
  })
}
