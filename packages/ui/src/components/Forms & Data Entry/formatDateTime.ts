/** `September 23, 2026 - 11:30 AM` (or just the date when `showTime` is false). */
export function formatDateTime(date: Date, showTime = true) {
  const day = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  if (!showTime) return day;
  return `${day} - ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}
