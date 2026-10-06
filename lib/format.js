// Shared constants and small formatting helpers (moved from App.js in
// Phase 1A; behavior unchanged).

// Basic email shape check (not full RFC 5322 validation): local part, "@",
// domain, a dot, and a TLD, no spaces. Enough to reject obviously invalid
// addresses without a validation library.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Seat limits for an offered ride. A typical car can carry at most 7
// passengers besides the driver, so anything outside 1–7 is rejected.
export const MIN_SEATS = 1;
export const MAX_SEATS = 7;

// Sort options for Available Rides. Departure Time works now that departure
// is stored as a real timestamp (rides.departure_at) instead of free text.
export const RIDE_SORT_OPTIONS = [
  { key: 'default', label: 'Default' },
  { key: 'destination', label: 'Destination' },
  { key: 'departure', label: 'Departure Time' },
];

// Minute steps shown in the departure time wheel.
export const DEPARTURE_MINUTE_INTERVAL = 5;

// Formats a departure Date for display, e.g. "Tue, Sep 30 · 5:30 PM". The
// year is only added when it isn't the current year.
export function formatDeparture(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return 'Unknown time';
  }
  const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  if (date.getFullYear() !== new Date().getFullYear()) {
    dateOptions.year = 'numeric';
  }
  const datePart = date.toLocaleDateString('en-US', dateOptions);
  const timePart = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${datePart} · ${timePart}`;
}

// A sensible starting value for the departure wheels: the next
// DEPARTURE_MINUTE_INTERVAL step at least 15 minutes from now.
export function getDefaultDeparture() {
  const step = DEPARTURE_MINUTE_INTERVAL * 60 * 1000;
  return new Date(Math.ceil((Date.now() + 15 * 60 * 1000) / step) * step);
}

// The profiles table stores emails lowercase (profiles_email_check), so every
// email sent to Supabase goes through this first. "  David@Email.com " and
// "david@email.com" are the same account.
export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// Gets a single uppercase letter to show inside an avatar circle.
export function getInitial(name) {
  return (name || '').trim().charAt(0).toUpperCase();
}
