/**
 * Date utility functions for the Health Coach app.
 * These functions help with date formatting and manipulation.
 */

/**
 * Format a date into a string with various format options
 * 
 * @param date The date to format
 * @param format The format type ('short', 'medium', 'long', 'relative')
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date, 
  format: 'short' | 'medium' | 'long' | 'relative' = 'medium'
): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  
  if (format === 'relative') {
    return getRelativeTimeString(date, now);
  }
  
  switch (format) {
    case 'short':
      // MM/DD/YY
      return `${date.getMonth() + 1}/${date.getDate()}/${String(date.getFullYear()).slice(2)}`;
    
    case 'long':
      // Month Day, Year (e.g., January 1, 2023)
      return `${getMonthName(date.getMonth())} ${date.getDate()}, ${date.getFullYear()}`;
    
    case 'medium':
    default:
      // MM/DD/YYYY
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
};

/**
 * Format a time string with options for 12-hour or 24-hour format
 * 
 * @param date The date containing the time to format
 * @param use24Hour Whether to use 24-hour format instead of AM/PM
 * @returns Formatted time string
 */
export const formatTime = (date: Date, use24Hour = false): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid time';
  }

  if (use24Hour) {
    // 24-hour format (e.g., 14:30)
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  } else {
    // 12-hour format with AM/PM (e.g., 2:30 PM)
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${hour12}:${String(minutes).padStart(2, '0')} ${ampm}`;
  }
};

/**
 * Format a date as "Today", "Yesterday" or the formatted date
 * 
 * @param date The date to format
 * @param formatStyle The format to use if not today/yesterday
 * @returns String representing the day (Today, Yesterday, or formatted date)
 */
export const formatDayRelative = (
  date: Date, 
  formatStyle: 'short' | 'medium' | 'long' = 'medium'
): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  
  if (isSameDay(date, now)) {
    return 'Today';
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  
  if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  }
  
  return formatDate(date, formatStyle);
};

/**
 * Check if two dates fall on the same day
 * 
 * @param date1 First date to compare
 * @param date2 Second date to compare
 * @returns True if dates are on the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  if (!date1 || !date2 || !(date1 instanceof Date) || !(date2 instanceof Date)) {
    return false;
  }
  
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Get a relative time string (e.g., "2 hours ago", "in 3 days")
 * 
 * @param date The date to calculate relative time for
 * @param baseDate The reference date (defaults to now)
 * @returns Relative time string
 */
export const getRelativeTimeString = (date: Date, baseDate: Date = new Date()): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diffInMs = date.getTime() - baseDate.getTime();
  const diffInSecs = Math.round(diffInMs / 1000);
  const diffInMins = Math.round(diffInSecs / 60);
  const diffInHours = Math.round(diffInMins / 60);
  const diffInDays = Math.round(diffInHours / 24);
  const diffInMonths = Math.round(diffInDays / 30.44);
  const diffInYears = Math.round(diffInDays / 365.25);
  
  if (Math.abs(diffInSecs) < 60) {
    return rtf.format(diffInSecs, 'second');
  } else if (Math.abs(diffInMins) < 60) {
    return rtf.format(diffInMins, 'minute');
  } else if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour');
  } else if (Math.abs(diffInDays) < 30) {
    return rtf.format(diffInDays, 'day');
  } else if (Math.abs(diffInMonths) < 12) {
    return rtf.format(diffInMonths, 'month');
  } else {
    return rtf.format(diffInYears, 'year');
  }
};

/**
 * Get an array of dates representing a week
 * 
 * @param referenceDate The reference date to get the week for
 * @param startOnMonday Whether weeks should start on Monday instead of Sunday
 * @returns Array of 7 dates representing the week
 */
export const getWeekDays = (referenceDate: Date = new Date(), startOnMonday = false): Date[] => {
  const date = new Date(referenceDate);
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate the start of the week
  const startDayOffset = startOnMonday ? (day === 0 ? -6 : 1 - day) : -day;
  date.setDate(date.getDate() + startDayOffset);
  
  // Create an array of 7 dates
  const weekDays: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const weekDay = new Date(date);
    weekDay.setDate(date.getDate() + i);
    weekDays.push(weekDay);
  }
  
  return weekDays;
};

/**
 * Get date range for a specific period
 * 
 * @param period The time period ('day', 'week', 'month', 'year')
 * @param referenceDate The reference date to calculate from
 * @returns Object with start and end dates for the period
 */
export const getDateRange = (
  period: 'day' | 'week' | 'month' | 'year',
  referenceDate: Date = new Date()
): { start: Date; end: Date } => {
  const date = new Date(referenceDate);
  let start: Date;
  let end: Date;
  
  switch (period) {
    case 'day':
      // Start: beginning of day, End: end of day
      start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
      end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
      break;
      
    case 'week':
      // Start: beginning of week (Sunday), End: end of Saturday
      start = new Date(date);
      start.setDate(date.getDate() - date.getDay());
      start.setHours(0, 0, 0, 0);
      
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
      
    case 'month':
      // Start: 1st of month, End: last day of month
      start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
      end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
      break;
      
    case 'year':
      // Start: January 1, End: December 31
      start = new Date(date.getFullYear(), 0, 1, 0, 0, 0);
      end = new Date(date.getFullYear(), 11, 31, 23, 59, 59);
      break;
      
    default:
      start = new Date(date);
      end = new Date(date);
  }
  
  return { start, end };
};

/**
 * Add a specified amount of time to a date
 * 
 * @param date The starting date
 * @param amount The amount to add
 * @param unit The unit of time ('minutes', 'hours', 'days', 'weeks', 'months', 'years')
 * @returns New date with the added time
 */
export const addToDate = (
  date: Date,
  amount: number,
  unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'
): Date => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return new Date();
  }

  const newDate = new Date(date);
  
  switch (unit) {
    case 'minutes':
      newDate.setMinutes(date.getMinutes() + amount);
      break;
    case 'hours':
      newDate.setHours(date.getHours() + amount);
      break;
    case 'days':
      newDate.setDate(date.getDate() + amount);
      break;
    case 'weeks':
      newDate.setDate(date.getDate() + (amount * 7));
      break;
    case 'months':
      newDate.setMonth(date.getMonth() + amount);
      break;
    case 'years':
      newDate.setFullYear(date.getFullYear() + amount);
      break;
  }
  
  return newDate;
};

/**
 * Get the name of a month from its index
 * 
 * @param monthIndex Month index (0-11)
 * @param shortName Whether to return short name (e.g., "Jan" vs "January")
 * @returns Name of the month
 */
export const getMonthName = (monthIndex: number, shortName = false): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  
  const shortMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  
  if (monthIndex < 0 || monthIndex > 11) {
    return '';
  }
  
  return shortName ? shortMonths[monthIndex] : months[monthIndex];
};

/**
 * Get the name of a day from its index
 * 
 * @param dayIndex Day index (0-6, Sunday to Saturday)
 * @param shortName Whether to return short name (e.g., "Sun" vs "Sunday")
 * @returns Name of the day
 */
export const getDayName = (dayIndex: number, shortName = false): string => {
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ];
  
  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  if (dayIndex < 0 || dayIndex > 6) {
    return '';
  }
  
  return shortName ? shortDays[dayIndex] : days[dayIndex];
}; 