// based on https://github.com/microsoft/vscode/blob/bd782eb059e133d3a20fdb446b8feb0010a278ad/src/vs/base/common/date.ts (License MIT)
import * as FormatDateStrings from '../FormatDateStrings/FormatDateStrings.js'

const minute = 60
const hour = minute * 60
const day = hour * 24
const week = day * 7
const month = day * 30
const year = day * 365

const formatDatePast = (seconds) => {
  if (seconds < minute) {
    if (seconds === 1) {
      return FormatDateStrings.oneSecondAgo()
    }
    return FormatDateStrings.someSecondsAgo(seconds)
  }
  if (seconds < hour) {
    const minutes = Math.floor(seconds / minute)
    if (minutes === 1) {
      return FormatDateStrings.oneMinuteAgo()
    }
    return FormatDateStrings.someMinutesAgo(minutes)
  }
  if (seconds < day) {
    const days = Math.floor(seconds / hour)
    if (days === 1) {
      return FormatDateStrings.oneHourAgo()
    }
    return FormatDateStrings.someHoursAgo(days)
  }
  if (seconds < week) {
    const days = Math.floor(seconds / day)
    if (days === 1) {
      return FormatDateStrings.oneDayAgo()
    }
    return FormatDateStrings.someDaysAgo(days)
  }
  if (seconds < month) {
    const weeks = Math.floor(seconds / week)
    if (weeks === 1) {
      return FormatDateStrings.oneWeekAgo()
    }
    return FormatDateStrings.someWeeksAgo(weeks)
  }
  if (seconds < year) {
    const months = Math.floor(seconds / month)
    if (months === 1) {
      return FormatDateStrings.oneMonthAgo()
    }
    return FormatDateStrings.someMonthsAgo(months)
  }
  const years = Math.floor(seconds / year)
  if (years === 1) {
    return FormatDateStrings.oneYearAgo()
  }
  return FormatDateStrings.someYearsAgo(years)
}

const formatDateFuture = (seconds) => {
  if (seconds < minute) {
    if (seconds === 1) {
      return FormatDateStrings.inOneSecond()
    }
    return FormatDateStrings.inSomeSeconds(seconds)
  }
  if (seconds < hour) {
    const minutes = Math.floor(seconds / minute)
    if (minutes === 1) {
      return FormatDateStrings.inOneMinute()
    }
    return FormatDateStrings.inSomeMinutes(minutes)
  }
  if (seconds < day) {
    const days = Math.floor(seconds / hour)
    if (days === 1) {
      return FormatDateStrings.inOneHour()
    }
    return FormatDateStrings.inSomeHours(days)
  }
  if (seconds < week) {
    const days = Math.floor(seconds / day)
    if (days === 1) {
      return FormatDateStrings.inOneDay()
    }
    return FormatDateStrings.inSomeDays(days)
  }
  if (seconds < month) {
    const weeks = Math.floor(seconds / week)
    if (weeks === 1) {
      return FormatDateStrings.inOneWeek()
    }
    return FormatDateStrings.inSomeWeeks(weeks)
  }
  if (seconds < year) {
    const months = Math.floor(seconds / month)
    if (months === 1) {
      return FormatDateStrings.inOneMonth()
    }
    return FormatDateStrings.inSomeMonths(months)
  }
  const years = Math.floor(seconds / year)
  if (years === 1) {
    return FormatDateStrings.inOneYear()
  }
  return FormatDateStrings.inSomeYears(years)
}

/**
 * @param {number} date
 * @param {number} now
 */
export const formatDate = (date, now) => {
  const difference = now - date
  const seconds = Math.round(difference / 1000)
  if (seconds >= 0) {
    return formatDatePast(seconds)
  }
  return formatDateFuture(-seconds)
}
