/**
 * Formats a date string based on how recent it is:
 * - If the date is today, returns only the time (e.g., "3:45 PM")
 * - If the date is not today, returns the date and time (e.g., "Oct 25, 3:45 PM")
 *
 * @param dateString - ISO date string or any date string parseable by Date constructor
 * @returns Formatted date/time string
 */
export const formatChatTime = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();

  // Check if the date is invalid
  if (isNaN(date.getTime())) return dateString;

  // Check if the date is today
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  // Format time (e.g., "3:45 PM")
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  const timeString = date.toLocaleTimeString(undefined, timeOptions);

  // If it's today, return only the time
  if (isToday) {
    return timeString;
  }

  // Otherwise, return date and time
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };
  const formattedDate = date.toLocaleDateString(undefined, dateOptions);

  return `${formattedDate}, ${timeString}`;
};
