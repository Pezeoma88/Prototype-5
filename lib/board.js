import { formatDeparture } from './format';

// Converts a `profiles` row into the account shape the app already uses.
export function profileToAccount(row) {
  return { id: row.id, name: row.name, email: row.email, role: row.role };
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
      }));
    const pendingRequests = requests
      .filter((req) => req.status === 'pending')
      .map((req) => ({
        id: req.id,
        riderId: req.rider_id,
        name: profilesById[req.rider_id]?.name || 'Unknown rider',
        reason: req.reason || '',
      }));
    const departureAt = new Date(ride.departure_at);
    return {
      id: ride.id,
      driverAccountId: ride.driver_id,
      name: profilesById[ride.driver_id]?.name || 'Unknown driver',
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
