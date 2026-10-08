import { formatDeparture } from './format';
import { getAvatarUrl } from './avatar';

// The `profiles` columns loaded for the signed-in account.
export const ACCOUNT_COLUMNS = 'id, name, email, role, bio, vehicle_make_model, avatar_path';

// The `profiles` columns loaded for the other people on the board: just what
// their cards show (name + photo), never their email.
export const BOARD_PROFILE_COLUMNS = 'id, name, avatar_path';

// Converts a `profiles` row into the account shape the app already uses.
// profiles.role is only the role picked at sign-up (legacy/compatibility
// data), so it's exposed as `legacyRole`: what the person is doing right now
// is App's activeMode, never this field. bio and vehicleMakeModel are ''
// when unset (NULL in Supabase), so screens can treat them as plain text.
// avatarUrl is the photo's public URL, or null for the initials avatar; it
// belongs to the person, so it's the same in Driver and Rider mode.
export function profileToAccount(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    legacyRole: row.role,
    bio: row.bio || '',
    vehicleMakeModel: row.vehicle_make_model || '',
    avatarPath: row.avatar_path || null,
    avatarUrl: getAvatarUrl(row.avatar_path),
  };
}

// The photo URL for a profile id on the board, or null for initials.
export function getBoardAvatarUrl(profilesById, profileId) {
  return getAvatarUrl(profilesById[profileId]?.avatar_path);
}

// Turns Supabase rows into the `drivers` state shape the UI already renders.
// Available seats are always derived as seat_count - accepted requests.
export function buildDriversFromRows(rideRows, requestRows, profilesById) {
  return rideRows.map((ride) => {
    const requests = requestRows.filter((req) => req.ride_id === ride.id);
    const matchedRiders = requests
      .filter((req) => req.status === 'accepted')
      .map((req) => ({
        id: req.rider_id,
        requestId: req.id,
        name: profilesById[req.rider_id]?.name || 'Unknown rider',
        avatarUrl: getBoardAvatarUrl(profilesById, req.rider_id),
      }));
    const pendingRequests = requests
      .filter((req) => req.status === 'pending')
      .map((req) => ({
        id: req.id,
        riderId: req.rider_id,
        name: profilesById[req.rider_id]?.name || 'Unknown rider',
        avatarUrl: getBoardAvatarUrl(profilesById, req.rider_id),
        reason: req.reason || '',
      }));
    const departureAt = new Date(ride.departure_at);
    return {
      id: ride.id,
      driverAccountId: ride.driver_id,
      name: profilesById[ride.driver_id]?.name || 'Unknown driver',
      avatarUrl: getBoardAvatarUrl(profilesById, ride.driver_id),
      destination: ride.destination,
      departureAt,
      departureTime: formatDeparture(departureAt),
      totalSeats: ride.seat_count,
      seats: Math.max(0, ride.seat_count - matchedRiders.length),
      matchedRiders,
      pendingRequests,
    };
  });
}
