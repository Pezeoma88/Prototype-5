import { useCallback, useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, Keyboard, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from './lib/supabase';
import { EMAIL_PATTERN, MAX_SEATS, MIN_SEATS, getDefaultDeparture, normalizeEmail } from './lib/format';
import { buildDriversFromRows, profileToAccount } from './lib/board';
import { colors } from './theme/theme';
import TabBar from './components/TabBar';
import SignInScreen from './screens/SignInScreen';
import HomeScreen from './screens/HomeScreen';
import RideDetailsScreen from './screens/RideDetailsScreen';
import RideForm from './screens/RideForm';
import RiderWaitlistForm from './screens/RiderWaitlistForm';
import MapScreen from './screens/MapScreen';
import RequestsScreen from './screens/RequestsScreen';
import ProfileScreen from './screens/ProfileScreen';

// Phase 1A layout: constants/helpers live in lib/format.js and lib/board.js,
// screens live in screens/, shared UI in components/, and design tokens in
// theme/theme.js. All app state and Supabase logic stay here in App.js and
// are passed down to the screens as props.

// This is the home screen for CarpoolBoard.
// Drivers can be added (with a name and seat count), riders can ask for a ride,
// and a waiting rider can be matched to a driver's open seat.
//
// Prototype 4: the board is persisted in Supabase. `profiles` holds accounts,
// `rides` holds posted rides, and `ride_requests` holds each rider's request
// (pending / accepted / denied / cancelled). The app reloads the whole board
// from Supabase on launch, on pull-to-refresh, and after every change, then
// rebuilds the same `drivers` / `riders` shapes the UI rendered before.
export default function App() {
  // The list of drivers (posted rides), rebuilt from Supabase on every load.
  // Each driver is an object like
  // { id, driverAccountId, name, destination, departureAt, departureTime,
  //   totalSeats, seats, matchedRiders, pendingRequests }.
  // id is the ride's Supabase UUID; departureAt is a Date and departureTime
  // its display string. seats is the number of AVAILABLE seats
  // (totalSeats - accepted requests), so it only goes down on Accept.
  // matchedRiders collects { id, requestId, name } for every confirmed passenger on this ride.
  // pendingRequests collects { id, riderId, name, reason } for requests the driver hasn't answered yet.
  const [drivers, setDrivers] = useState([]);

  // True until the first Supabase load finishes, so the empty state isn't
  // shown before we actually know the board is empty.
  const [isBoardLoading, setIsBoardLoading] = useState(true);
  // True while a pull-to-refresh reload is running.
  const [isRefreshing, setIsRefreshing] = useState(false);
  // The last load error, if any. Already-loaded rides stay on screen.
  const [boardError, setBoardError] = useState('');

  // The signed-in account: { id, name, email, role }, or null when signed
  // out. id is the profile's stable Supabase UUID. This is a prototype, NOT
  // secure production authentication — there's no password and no Supabase
  // Auth. The email is the account's identifier (case-insensitive): "signing
  // up" creates a `profiles` row with a name + email + role, and "logging in"
  // again with the same email restores that same profile and its role.
  const [currentUser, setCurrentUser] = useState(null);

  // True while a Continue press is talking to Supabase.
  const [isSigningIn, setIsSigningIn] = useState(false);

  // The existing profile matching the email typed on the sign-in screen (or
  // null), looked up in Supabase shortly after the user stops typing.
  const [matchingAuthAccount, setMatchingAuthAccount] = useState(null);

  // The current text typed into the sign-in form, and the role toggle. Name
  // and role are only used when the email doesn't match an existing account.
  const [authNameInput, setAuthNameInput] = useState('');
  const [authEmailInput, setAuthEmailInput] = useState('');
  const [authRole, setAuthRole] = useState('driver');
  const [authError, setAuthError] = useState('');

  // Spike: a short message about the last request action (or why one was blocked).
  const [requestNotice, setRequestNotice] = useState('');

  // Whether the "Add Driver" form is currently showing.
  const [isAddingDriver, setIsAddingDriver] = useState(false);

  // The id of the ride being edited in the Post Ride form, or null when the
  // form is posting a new ride.
  const [editingRideId, setEditingRideId] = useState(null);

  // The current text typed into the form's inputs. The driver's name isn't
  // one of them: it comes from the signed-in account when the ride is posted.
  const [destinationInput, setDestinationInput] = useState('');
  const [seatsInput, setSeatsInput] = useState('');

  // The departure picked on the date/time wheels (a Date), or null until the
  // driver picks one. Saved to Supabase as rides.departure_at.
  const [departureAtInput, setDepartureAtInput] = useState(null);
  // When editing, the ride's original departure, so an unchanged (possibly
  // already-past) departure doesn't block saving other edits.
  const [originalDepartureAt, setOriginalDepartureAt] = useState(null);
  // Which wheel is open: 'date', 'time', or null when neither is showing.
  const [departurePickerMode, setDeparturePickerMode] = useState(null);

  // A validation message to show under the form, if something is wrong.
  const [formError, setFormError] = useState('');

  // How Available Rides is ordered: 'default' (posting order) or 'destination'.
  const [rideSortOrder, setRideSortOrder] = useState('default');

  // True while a Post Ride press is being handled, so a fast double-tap
  // can't post the same ride twice before the form has a chance to close.
  const [isSubmittingDriver, setIsSubmittingDriver] = useState(false);

  // Lets us scroll back to the top (Available Rides) after saving a ride.
  const scrollViewRef = useRef(null);

  // Riders who joined Looking for a Ride on this device without sending a
  // request yet: { id, name }. There's no Supabase table for the waiting
  // list itself, so these entries last only for this app session. Riders
  // with a pending request are rebuilt from Supabase instead (see `riders`).
  const [localWaitingRiders, setLocalWaitingRiders] = useState([]);

  // Every request row with status pending/accepted, from the last load. Used
  // to rebuild Looking for a Ride.
  const [activeRequestRows, setActiveRequestRows] = useState([]);
  // Profiles referenced by the loaded rides/requests, keyed by id.
  const [profilesById, setProfilesById] = useState({});

  // Guards against a fast double-tap firing the same Supabase change twice.
  const isBoardActionRunningRef = useRef(false);

  // Looking for a Ride, rebuilt as { id, name }: everyone with a pending
  // request in Supabase, plus anyone who joined on this device, minus anyone
  // who already has a confirmed (accepted) seat.
  const confirmedRiderIds = new Set(
    activeRequestRows.filter((req) => req.status === 'accepted').map((req) => req.rider_id)
  );
  const riders = [];
  for (const req of activeRequestRows) {
    if (req.status === 'pending' && !riders.some((r) => r.id === req.rider_id)) {
      riders.push({ id: req.rider_id, name: profilesById[req.rider_id]?.name || 'Unknown rider' });
    }
  }
  for (const rider of localWaitingRiders) {
    if (!riders.some((r) => r.id === rider.id)) {
      riders.push(rider);
    }
  }
  for (let i = riders.length - 1; i >= 0; i -= 1) {
    if (confirmedRiderIds.has(riders[i].id)) {
      riders.splice(i, 1);
    }
  }

  // Whether the "Request a Ride" panel is currently showing. The rider's
  // name comes from their signed-in account, so the panel has no inputs.
  const [isAddingRider, setIsAddingRider] = useState(false);

  // The id of the ride whose request-confirm panel is open, or null if none.
  const [reservingDriverId, setReservingDriverId] = useState(null);

  // The optional message a rider types to explain why they need a ride,
  // shown to the driver alongside their Pending request.
  const [requestReasonInput, setRequestReasonInput] = useState('');

  // Which bottom tab is showing: 'home', 'map', 'requests', or 'profile'.
  // The Profile tab replaces Prototype 4's Profile overlay.
  const [activeTab, setActiveTab] = useState('home');

  // Details of the most recently confirmed match, or null when no confirmation is showing.
  // Shape: { riderName, driverName, destination, departureTime }.
  const [matchConfirmation, setMatchConfirmation] = useState(null);

  // The id of the driver whose Ride Details screen is currently open, or null if none.
  const [selectedRideDriverId, setSelectedRideDriverId] = useState(null);

  // Loads the whole board from Supabase: rides, their pending/accepted
  // requests, and the profiles those rows point at. On failure the rides
  // already on screen are kept and an error message is shown instead.
  const loadBoard = useCallback(async () => {
    try {
      const { data: rideRows, error: ridesError } = await supabase
        .from('rides')
        .select('id, driver_id, destination, departure_at, seat_count, created_at')
        .order('created_at', { ascending: true })
        .order('id', { ascending: true });
      if (ridesError) throw ridesError;

      const { data: requestRows, error: requestsError } = await supabase
        .from('ride_requests')
        .select('id, ride_id, rider_id, reason, status, created_at')
        .in('status', ['pending', 'accepted'])
        .order('created_at', { ascending: true });
      if (requestsError) throw requestsError;

      const profileIds = [
        ...new Set([
          ...rideRows.map((ride) => ride.driver_id),
          ...requestRows.map((req) => req.rider_id),
        ]),
      ];
      let profileMap = {};
      if (profileIds.length > 0) {
        const { data: profileRows, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, email, role')
          .in('id', profileIds);
        if (profilesError) throw profilesError;
        profileMap = Object.fromEntries(profileRows.map((row) => [row.id, row]));
      }

      setProfilesById(profileMap);
      setActiveRequestRows(requestRows);
      setDrivers(buildDriversFromRows(rideRows, requestRows, profileMap));
      setBoardError('');
      return true;
    } catch (error) {
      console.warn('CarpoolBoard: failed to load board from Supabase', error);
      setBoardError("Couldn't load rides from the server. Pull down to try again.");
      return false;
    } finally {
      setIsBoardLoading(false);
    }
  }, []);

  // Restore the board from Supabase as soon as CarpoolBoard launches.
  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  // Pull-to-refresh: fetch the latest board without restarting the app.
  async function handleRefresh() {
    setIsRefreshing(true);
    await loadBoard();
    setIsRefreshing(false);
  }

  // Runs one Supabase change at a time (ignoring double-taps), then reloads
  // the board so the UI always reflects what's actually stored.
  async function runBoardAction(action) {
    if (isBoardActionRunningRef.current) {
      return;
    }
    isBoardActionRunningRef.current = true;
    try {
      await action();
    } finally {
      isBoardActionRunningRef.current = false;
      await loadBoard();
    }
  }

  // Looks up a profile by email (case-insensitive, via normalizeEmail).
  // Returns the account or null; throws on a network/database error.
  async function findProfileByEmail(email) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, role')
      .eq('email', normalizeEmail(email))
      .limit(1);
    if (error) throw error;
    return data.length > 0 ? profileToAccount(data[0]) : null;
  }

  // Live-matches the sign-in email field against existing profiles in
  // Supabase, so the form can show a "welcome back" notice and skip the
  // name/role fields before the user even presses Continue. The lookup waits
  // until typing pauses, and ignores results for an email that's since changed.
  const trimmedAuthEmail = normalizeEmail(authEmailInput);
  useEffect(() => {
    setMatchingAuthAccount(null);
    if (currentUser !== null || !EMAIL_PATTERN.test(trimmedAuthEmail)) {
      return undefined;
    }
    let isStale = false;
    const timer = setTimeout(() => {
      findProfileByEmail(trimmedAuthEmail)
        .then((account) => {
          if (!isStale) setMatchingAuthAccount(account);
        })
        .catch(() => {
          // Continue will retry the lookup and report any real error.
        });
    }, 400);
    return () => {
      isStale = true;
      clearTimeout(timer);
    };
  }, [trimmedAuthEmail, currentUser]);

  // Runs when the user presses "Continue" on the sign-in screen. An email
  // that matches an existing profile logs back into it (keeping the name and
  // role on file); a new email requires a name and role to create a new
  // profile in Supabase. Email (not name) is the account identifier.
  async function handleSignIn() {
    if (isSigningIn) {
      return;
    }
    const trimmedName = authNameInput.trim();
    // Normalized so lookup and insert both use the lowercase form Supabase
    // requires. The text field itself still shows what the user typed.
    const trimmedEmail = normalizeEmail(authEmailInput);

    if (trimmedEmail === '') {
      setAuthError('Please enter your email address.');
      return;
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    setIsSigningIn(true);
    try {
      let account = await findProfileByEmail(trimmedEmail);

      if (!account) {
        if (trimmedName === '') {
          setAuthError('Please enter your name.');
          return;
        }
        const { data, error } = await supabase
          .from('profiles')
          .insert({ name: trimmedName, email: trimmedEmail, role: authRole })
          .select('id, name, email, role')
          .single();
        if (error) {
          // 23505 = unique violation: the email was registered in the
          // meantime (e.g. from another phone), so just log into that one.
          if (error.code === '23505') {
            account = await findProfileByEmail(trimmedEmail);
          }
          if (!account) throw error;
        } else {
          account = profileToAccount(data);
        }
      }

      setCurrentUser(account);
      setAuthNameInput('');
      setAuthEmailInput('');
      setAuthError('');
      loadBoard();
    } catch (error) {
      console.warn('CarpoolBoard: sign-in failed', error);
      setAuthError("Couldn't reach CarpoolBoard's server. Check your connection and try again.");
    } finally {
      setIsSigningIn(false);
    }
  }

  // Signs the current account out. The shared board (drivers/riders) is left
  // untouched so the next person to sign in still sees the same board.
  function handleSignOut() {
    setCurrentUser(null);
    resetForm();
    setIsAddingRider(false);
    setSelectedRideDriverId(null);
    setReservingDriverId(null);
    setRequestNotice('');
    setActiveTab('home');
  }

  // Opens the Offer a Ride form.
  function handleAddDriver() {
    setIsAddingDriver(true);
  }

  // Opens the same Post Ride form pre-filled with one of the signed-in
  // driver's rides, so they can change its destination, departure, or seats.
  function handleStartEditRide(driverId) {
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver || !currentUser || driver.driverAccountId !== currentUser.id) {
      return;
    }
    setEditingRideId(driver.id);
    setDestinationInput(driver.destination);
    setDepartureAtInput(driver.departureAt);
    setOriginalDepartureAt(driver.departureAt);
    setSeatsInput(String(driver.totalSeats));
    setDeparturePickerMode(null);
    setFormError('');
    setSelectedRideDriverId(null);
    setReservingDriverId(null);
    setRequestNotice('');
    setIsAddingDriver(true);
    // The form replaces the board on the Home screen and opens scrolled to
    // the top (HomeScreen remounts its ScrollView per view), so no extra
    // scrolling is needed here.
  }

  // Closes the form and clears out anything the user typed.
  function resetForm() {
    setIsAddingDriver(false);
    setEditingRideId(null);
    setDestinationInput('');
    setDepartureAtInput(null);
    setOriginalDepartureAt(null);
    setDeparturePickerMode(null);
    setSeatsInput('');
    setFormError('');
    setIsSubmittingDriver(false);
  }

  // Shows (or hides, if it's already showing) the date or time wheel.
  // The first time a wheel opens, it starts from a near-future default.
  function handleToggleDeparturePicker(mode) {
    Keyboard.dismiss();
    if (departureAtInput === null) {
      setDepartureAtInput(getDefaultDeparture());
    }
    setDeparturePickerMode((current) => (current === mode ? null : mode));
  }

  // Called as the driver scrolls a wheel. The date wheel only changes the
  // day and the time wheel only changes the hour/minute, so the two picks
  // combine into one departure Date.
  function handleDeparturePicked(pickedDate) {
    if (!(pickedDate instanceof Date) || Number.isNaN(pickedDate.getTime())) {
      return;
    }
    const mode = departurePickerMode;
    setDepartureAtInput((current) => {
      const combined = new Date(current || getDefaultDeparture());
      if (mode === 'date') {
        combined.setFullYear(pickedDate.getFullYear(), pickedDate.getMonth(), pickedDate.getDate());
      } else {
        combined.setHours(pickedDate.getHours(), pickedDate.getMinutes(), 0, 0);
      }
      return combined;
    });
    // Android shows the picker as a one-shot dialog, so close it after a pick.
    if (Platform.OS !== 'ios') {
      setDeparturePickerMode(null);
    }
  }

  // Runs when the user presses "Post Ride" (or "Save Changes" when editing).
  // The ride is posted under the signed-in account's name, so the driver
  // never has to type it. The ride is written to Supabase, then the board
  // is reloaded from Supabase.
  async function handleSaveDriver() {
    // Guards against a fast double-tap posting the same ride twice.
    if (isSubmittingDriver || !currentUser) {
      return;
    }

    const trimmedDestination = destinationInput.trim();
    const seatsNumber = Number(seatsInput.trim());
    const editingDriver =
      editingRideId !== null ? drivers.find((d) => d.id === editingRideId) || null : null;
    const departureUnchanged =
      editingDriver !== null &&
      departureAtInput !== null &&
      originalDepartureAt !== null &&
      departureAtInput.getTime() === originalDepartureAt.getTime();

    // Validation: destination can't be empty, a departure must be picked and
    // be in the future, and seats must be a whole number from MIN_SEATS to
    // MAX_SEATS. When editing, an unchanged departure is allowed as-is.
    if (trimmedDestination === '') {
      setFormError('Please enter a destination.');
      return;
    }
    if (departureAtInput === null || Number.isNaN(departureAtInput.getTime())) {
      setFormError('Please choose a departure date and time.');
      return;
    }
    if (!departureUnchanged && departureAtInput.getTime() <= Date.now()) {
      setFormError('Departure must be in the future. Please pick a later date or time.');
      return;
    }
    if (
      seatsInput.trim() === '' ||
      !Number.isInteger(seatsNumber) ||
      seatsNumber < MIN_SEATS ||
      seatsNumber > MAX_SEATS
    ) {
      setFormError(`Seats must be between ${MIN_SEATS} and ${MAX_SEATS}.`);
      return;
    }
    if (editingRideId !== null && !editingDriver) {
      setFormError('This ride no longer exists. It may have been removed.');
      return;
    }

    setIsSubmittingDriver(true);
    setFormError('');

    try {
      if (editingDriver) {
        // Re-check confirmed riders against the server right before saving,
        // so total seats can't drop below who's already been accepted.
        const { count: acceptedCount, error: countError } = await supabase
          .from('ride_requests')
          .select('id', { count: 'exact', head: true })
          .eq('ride_id', editingDriver.id)
          .eq('status', 'accepted');
        if (countError) throw countError;
        if (seatsNumber < (acceptedCount ?? 0)) {
          setFormError(
            `This ride already has ${acceptedCount} confirmed rider${acceptedCount === 1 ? '' : 's'}, ` +
              `so it needs at least ${acceptedCount} seat${acceptedCount === 1 ? '' : 's'}.`
          );
          setIsSubmittingDriver(false);
          return;
        }

        const { data, error } = await supabase
          .from('rides')
          .update({
            destination: trimmedDestination,
            departure_at: departureAtInput.toISOString(),
            seat_count: seatsNumber,
          })
          .eq('id', editingDriver.id)
          .eq('driver_id', currentUser.id)
          .select('id');
        if (error) throw error;
        if (!data || data.length === 0) {
          throw new Error('No ride was updated.');
        }
      } else {
        const { error } = await supabase.from('rides').insert({
          driver_id: currentUser.id,
          destination: trimmedDestination,
          departure_at: departureAtInput.toISOString(),
          seat_count: seatsNumber,
        });
        if (error) throw error;
      }
    } catch (error) {
      console.warn('CarpoolBoard: saving ride failed', error);
      setFormError(
        editingDriver
          ? "Couldn't save your changes. Check your connection and try again."
          : "Couldn't post your ride. Check your connection and try again."
      );
      setIsSubmittingDriver(false);
      return;
    }

    // Success: dismiss the keyboard, close/reset the form, reload the board,
    // and scroll back up so the ride is visible in Available Rides right away.
    Keyboard.dismiss();
    resetForm();
    await loadBoard();
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }

  // Opens the Ride Details screen for a driver. This is the Available Rides -> Ride Details step.
  function handleViewRideDetails(driverId) {
    setSelectedRideDriverId(driverId);
    setRequestNotice('');
  }

  // Closes the Ride Details screen (and any in-progress matching) and returns to Available Rides.
  function handleBackToAvailableRides() {
    setSelectedRideDriverId(null);
    setReservingDriverId(null);
    setRequestNotice('');
  }

  // Cancels/rescinds an offered ride: removes it from Available Rides and
  // clears any Ride Details / Rider Matching state pointing at it. Other
  // drivers and riders are untouched. Only the driver who posted the ride
  // can rescind it, and we confirm first since this can't be undone.
  function handleCancelRide(driverId) {
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver || !currentUser || driver.driverAccountId !== currentUser.id) {
      return;
    }

    Alert.alert(
      'Cancel this ride?',
      `This removes your ride to ${driver.destination} and can't be undone.`,
      [
        { text: 'Keep Ride', style: 'cancel' },
        {
          text: 'Cancel Ride',
          style: 'destructive',
          onPress: () =>
            runBoardAction(async () => {
              // Deleting the ride also removes its ride_requests through the
              // database's ON DELETE CASCADE relationship.
              const { data, error } = await supabase
                .from('rides')
                .delete()
                .eq('id', driverId)
                .eq('driver_id', currentUser.id)
                .select('id');
              if (error || !data || data.length === 0) {
                console.warn('CarpoolBoard: cancelling ride failed', error);
                setRequestNotice("Couldn't cancel this ride. Check your connection and try again.");
                return;
              }
              setSelectedRideDriverId(null);
              setReservingDriverId(null);
              setRequestNotice('');
            }),
        },
      ],
      { cancelable: true }
    );
  }

  // Opens (or closes, if already open) the request-confirm panel for a
  // driver, clearing any reason text left over from a different ride.
  function handleStartReserve(driverId) {
    setReservingDriverId((currentId) => (currentId === driverId ? null : driverId));
    setRequestReasonInput('');
  }

  // Closes the request-confirm panel without sending a request.
  function handleCancelReserve() {
    setReservingDriverId(null);
    setRequestReasonInput('');
  }

  // SPIKE, step 1: a waiting rider requests this specific ride, optionally
  // with a short reason so the driver has context when deciding. The request
  // is saved to ride_requests as Pending. Seats do NOT change yet, and the
  // rider stays in the waiting list (they could still request other rides).
  async function handleRequestRide(driverId, riderId, reason) {
    const driver = drivers.find((d) => d.id === driverId);
    const rider = currentUser && currentUser.id === riderId ? currentUser : null;
    if (!driver || !rider) {
      return;
    }

    // Nobody can request their own ride. The UI already hides the button for
    // this case; this is the backstop in case it's ever reached another way.
    if (driver.driverAccountId === riderId) {
      return;
    }

    if (driver.seats < 1) {
      setRequestNotice('This ride is full, so it is not accepting requests.');
      return;
    }
    if (driver.matchedRiders.some((r) => r.id === riderId)) {
      setRequestNotice(`${rider.name} is already a confirmed passenger on this ride.`);
      return;
    }
    if (driver.pendingRequests.some((req) => req.riderId === riderId)) {
      setRequestNotice(`${rider.name} already has a pending request for this ride.`);
      return;
    }

    const trimmedReason = reason ? reason.trim() : '';

    await runBoardAction(async () => {
      // A rider who was denied, or who gave up a seat, keeps an old row for
      // this ride. Re-requesting reopens that row as Pending instead of
      // adding a second one.
      const { data: existingRows, error: lookupError } = await supabase
        .from('ride_requests')
        .select('id, status')
        .eq('ride_id', driverId)
        .eq('rider_id', rider.id);
      if (lookupError) {
        console.warn('CarpoolBoard: request lookup failed', lookupError);
        setRequestNotice("Couldn't send your request. Check your connection and try again.");
        return;
      }
      if (existingRows.some((row) => row.status === 'accepted')) {
        setRequestNotice(`${rider.name} is already a confirmed passenger on this ride.`);
        return;
      }
      if (existingRows.some((row) => row.status === 'pending')) {
        setRequestNotice(`${rider.name} already has a pending request for this ride.`);
        return;
      }

      const { error } =
        existingRows.length > 0
          ? await supabase
              .from('ride_requests')
              .update({ status: 'pending', reason: trimmedReason || null })
              .eq('id', existingRows[0].id)
          : await supabase.from('ride_requests').insert({
              ride_id: driverId,
              rider_id: rider.id,
              reason: trimmedReason || null,
              status: 'pending',
            });
      if (error) {
        // P0001 = an error raised on purpose by the database (e.g. the
        // prevent_self_request trigger), whose message is meant for users.
        console.warn('CarpoolBoard: sending request failed', error);
        setRequestNotice(
          error.code === 'P0001' && error.message
            ? error.message
            : "Couldn't send your request. Check your connection and try again."
        );
        return;
      }

      setReservingDriverId(null);
      setRequestReasonInput('');
      setRequestNotice(`${rider.name}'s request is now Pending.`);
    });
  }

  // SPIKE, step 2a: the driver accepts a pending request.
  // The rider becomes a confirmed passenger, available seats go down by 1,
  // and the rider leaves the waiting list (their requests to other rides are
  // cancelled). The accept itself runs in the database's accept_ride_request
  // function, which is what prevents overbooking.
  async function handleAcceptRequest(driverId, requestId) {
    const driver = drivers.find((d) => d.id === driverId);
    const request = driver && driver.pendingRequests.find((req) => req.id === requestId);
    if (!driver || !request) {
      return;
    }

    // A driver can never accept themselves as a passenger on their own ride.
    if (request.riderId === driver.driverAccountId) {
      return;
    }

    // Edge case: the ride filled up while this request was waiting.
    if (driver.seats < 1) {
      setRequestNotice('This ride is full. Deny the request or free up a seat first.');
      return;
    }

    await runBoardAction(async () => {
      const { error } = await supabase.rpc('accept_ride_request', { p_request_id: requestId });
      if (error) {
        // P0001 = a rule enforced by accept_ride_request (e.g. the ride is
        // full, or the request is no longer pending); its message is for users.
        console.warn('CarpoolBoard: accepting request failed', error);
        setRequestNotice(
          error.code === 'P0001' && error.message
            ? error.message
            : "Couldn't accept this request. Check your connection and try again."
        );
        return;
      }

      // The rider has a seat now, so withdraw their other pending requests
      // and take them off Looking for a Ride.
      const { error: cleanupError } = await supabase
        .from('ride_requests')
        .update({ status: 'cancelled' })
        .eq('rider_id', request.riderId)
        .eq('status', 'pending');
      if (cleanupError) {
        console.warn("CarpoolBoard: cancelling rider's other requests failed", cleanupError);
      }
      setLocalWaitingRiders((current) => current.filter((r) => r.id !== request.riderId));
      setRequestNotice(`${request.name} accepted: now a confirmed passenger.`);
    });
  }

  // SPIKE, step 2b: the driver denies a pending request.
  // The request is marked denied; seats and confirmed passengers are unchanged.
  async function handleDenyRequest(driverId, requestId) {
    const driver = drivers.find((d) => d.id === driverId);
    const request = driver && driver.pendingRequests.find((req) => req.id === requestId);
    if (!driver || !request) {
      return;
    }

    await runBoardAction(async () => {
      const { data, error } = await supabase
        .from('ride_requests')
        .update({ status: 'denied' })
        .eq('id', requestId)
        .eq('status', 'pending')
        .select('id');
      if (error || !data || data.length === 0) {
        console.warn('CarpoolBoard: denying request failed', error);
        setRequestNotice("Couldn't deny this request. It may have already changed. Pull down to refresh.");
        return;
      }
      setRequestNotice(`${request.name}'s request was denied. Seats unchanged.`);
    });
  }

  // A confirmed rider gives up their seat: the seat re-opens on the ride
  // (so a "Full" ride stops showing as Full), and they go back to Looking
  // for a Ride so they can find another one. Only the rider themselves can
  // cancel their own seat.
  function handleCancelConfirmedSeat(driverId, riderId) {
    const driver = drivers.find((d) => d.id === driverId);
    const rider = driver && driver.matchedRiders.find((r) => r.id === riderId);
    if (!driver || !rider || !currentUser || currentUser.id !== riderId) {
      return;
    }

    Alert.alert(
      'Cancel your seat?',
      `You'll give up your confirmed seat on ${driver.name}'s ride to ${driver.destination}.`,
      [
        { text: 'Keep My Seat', style: 'cancel' },
        {
          text: 'Cancel Seat',
          style: 'destructive',
          onPress: () =>
            runBoardAction(async () => {
              // Marking the accepted request cancelled frees the seat, since
              // available seats are always seat_count - accepted requests.
              const { data, error } = await supabase
                .from('ride_requests')
                .update({ status: 'cancelled' })
                .eq('id', rider.requestId)
                .eq('status', 'accepted')
                .select('id');
              if (error || !data || data.length === 0) {
                console.warn('CarpoolBoard: cancelling seat failed', error);
                setRequestNotice("Couldn't cancel your seat. Check your connection and try again.");
                return;
              }
              setLocalWaitingRiders((current) =>
                current.some((r) => r.id === riderId)
                  ? current
                  : [...current, { id: riderId, name: rider.name }]
              );
              setRequestNotice(`${rider.name} canceled their seat. A seat is now open.`);
            }),
        },
      ],
      { cancelable: true }
    );
  }

  // Dismisses the Match Confirmed screen and returns to the normal home view.
  function handleDismissMatchConfirmation() {
    setMatchConfirmation(null);
  }

  // Opens the Request a Ride panel.
  function handleNeedRide() {
    setIsAddingRider(true);
  }

  // Closes the Request a Ride panel.
  function resetRiderForm() {
    setIsAddingRider(false);
  }

  // Runs when the rider presses "Add Me to Looking for a Ride". They're
  // listed under their account name, so there's nothing to type.
  function handleSaveRider() {
    if (!currentUser) {
      return;
    }

    // Riders are tied to their account id, so re-saving (e.g. after already
    // joining) just closes the form instead of adding a duplicate entry.
    if (riders.some((rider) => rider.id === currentUser.id)) {
      resetRiderForm();
      return;
    }

    // Add the new rider to the list, keeping all the existing riders.
    const newRider = {
      id: currentUser.id,
      name: currentUser.name,
    };
    setLocalWaitingRiders((current) => [...current, newRider]);

    resetRiderForm();
  }

  // A waiting rider stops looking for a ride: they leave the waiting list,
  // and any pending requests they had out to drivers are withdrawn too.
  function handleLeaveWaitlist(riderId) {
    const rider = riders.find((r) => r.id === riderId);
    if (!rider || !currentUser || currentUser.id !== riderId) {
      return;
    }

    Alert.alert(
      'Stop looking for a ride?',
      'This also cancels any pending requests you have sent.',
      [
        { text: 'Stay on the List', style: 'cancel' },
        {
          text: 'Remove Me',
          style: 'destructive',
          onPress: () =>
            runBoardAction(async () => {
              const { error } = await supabase
                .from('ride_requests')
                .update({ status: 'cancelled' })
                .eq('rider_id', riderId)
                .eq('status', 'pending');
              if (error) {
                console.warn('CarpoolBoard: withdrawing requests failed', error);
                Alert.alert(
                  "Couldn't remove you",
                  'Your pending requests could not be cancelled. Check your connection and try again.'
                );
                return;
              }
              setLocalWaitingRiders((current) => current.filter((r) => r.id !== riderId));
            }),
        },
      ],
      { cancelable: true }
    );
  }

  const detailsDriver = drivers.find((driver) => driver.id === selectedRideDriverId) || null;
  // Only the driver who posted a ride can manage it (accept/deny, cancel).
  const isOwnerDriver =
    currentUser !== null &&
    currentUser.role === 'driver' &&
    detailsDriver !== null &&
    detailsDriver.driverAccountId === currentUser.id;
  // True when the open ride belongs to the signed-in account, whatever its
  // role. Used to hide any action that would let someone interact with
  // their own listing (e.g. requesting a seat on their own ride).
  const isOwnDetailsRide =
    currentUser !== null &&
    detailsDriver !== null &&
    detailsDriver.driverAccountId === currentUser.id;
  const isCurrentUserWaiting =
    currentUser !== null && riders.some((rider) => rider.id === currentUser.id);

  // Available Rides in the chosen order. Sorting a copy keeps `drivers`
  // itself in posting order, which is what "Default" shows. Departure Time
  // puts upcoming rides first (soonest at the front), then rides whose
  // departure has already passed, each group in chronological order.
  const nowMs = Date.now();
  let sortedDrivers = drivers;
  if (rideSortOrder === 'destination') {
    sortedDrivers = [...drivers].sort((a, b) =>
      a.destination.localeCompare(b.destination, undefined, { sensitivity: 'base' })
    );
  } else if (rideSortOrder === 'departure') {
    sortedDrivers = [...drivers].sort((a, b) => {
      const aTime = a.departureAt.getTime();
      const bTime = b.departureAt.getTime();
      const aPast = aTime < nowMs;
      const bPast = bTime < nowMs;
      if (aPast !== bPast) {
        return aPast ? 1 : -1;
      }
      return aTime - bTime;
    });
  }

  // The ride open in the form's Edit mode, if any.
  const editingDriver =
    editingRideId !== null ? drivers.find((driver) => driver.id === editingRideId) || null : null;

  // Past days can't be picked on the date wheel. On the time wheel, earlier
  // times are blocked only when the chosen day is today. No limit is set when
  // editing a ride whose saved departure already passed, so the wheels still
  // show its real value (saving a changed departure still requires a future time).
  const departurePickerMinimumDate = (() => {
    const now = new Date();
    let minimum;
    if (departurePickerMode === 'date') {
      minimum = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (
      departureAtInput !== null &&
      departureAtInput.toDateString() === now.toDateString()
    ) {
      minimum = now;
    }
    if (minimum && departureAtInput !== null && departureAtInput < minimum) {
      return undefined;
    }
    return minimum;
  })();

  // A rider taps "Request This Ride" on Ride Details: they join the shared
  // waiting list automatically (using their own account) the first time they
  // request a ride, and the request-confirm panel opens.
  function handleBeginRequest(driverId) {
    if (!currentUser) {
      return;
    }
    setLocalWaitingRiders((current) =>
      current.some((r) => r.id === currentUser.id)
        ? current
        : [...current, { id: currentUser.id, name: currentUser.name }]
    );
    handleStartReserve(driverId);
  }

  // A rider taps "Request Ride" on a Home ride card: opens that ride's
  // details with the request-confirm panel already open. It's the same flow
  // as opening the ride and tapping Request This Ride, just one tap shorter.
  function handleQuickRequest(driverId) {
    handleViewRideDetails(driverId);
    handleBeginRequest(driverId);
  }

  // Tapping your avatar on Home opens the Profile tab.
  function handleOpenProfile() {
    setActiveTab('profile');
  }

  // Switches bottom tabs. Tapping Home while already on Home closes Ride
  // Details and returns to the board, like most mobile apps.
  function handleTabPress(tabKey) {
    Keyboard.dismiss();
    if (tabKey === 'home' && activeTab === 'home') {
      handleBackToAvailableRides();
    }
    setActiveTab(tabKey);
  }

  function handleGoHome() {
    setActiveTab('home');
  }

  if (currentUser === null) {
    return (
      <SafeAreaProvider>
        <SignInScreen
          authEmailInput={authEmailInput}
          setAuthEmailInput={setAuthEmailInput}
          matchingAuthAccount={matchingAuthAccount}
          authNameInput={authNameInput}
          setAuthNameInput={setAuthNameInput}
          authRole={authRole}
          setAuthRole={setAuthRole}
          authError={authError}
          isSigningIn={isSigningIn}
          handleSignIn={handleSignIn}
        />
      </SafeAreaProvider>
    );
  }

  const detailsView =
    detailsDriver !== null ? (
      <RideDetailsScreen
        detailsDriver={detailsDriver}
        currentUser={currentUser}
        requestNotice={requestNotice}
        isOwnerDriver={isOwnerDriver}
        isOwnDetailsRide={isOwnDetailsRide}
        reservingDriverId={reservingDriverId}
        requestReasonInput={requestReasonInput}
        setRequestReasonInput={setRequestReasonInput}
        handleBackToAvailableRides={handleBackToAvailableRides}
        handleAcceptRequest={handleAcceptRequest}
        handleDenyRequest={handleDenyRequest}
        handleCancelConfirmedSeat={handleCancelConfirmedSeat}
        handleBeginRequest={handleBeginRequest}
        handleRequestRide={handleRequestRide}
        handleCancelReserve={handleCancelReserve}
        handleStartEditRide={handleStartEditRide}
        handleCancelRide={handleCancelRide}
      />
    ) : null;

  const rideForm = (
    <RideForm
      currentUser={currentUser}
      editingRideId={editingRideId}
      editingDriver={editingDriver}
      destinationInput={destinationInput}
      setDestinationInput={setDestinationInput}
      departureAtInput={departureAtInput}
      departurePickerMode={departurePickerMode}
      setDeparturePickerMode={setDeparturePickerMode}
      departurePickerMinimumDate={departurePickerMinimumDate}
      handleToggleDeparturePicker={handleToggleDeparturePicker}
      handleDeparturePicked={handleDeparturePicked}
      seatsInput={seatsInput}
      setSeatsInput={setSeatsInput}
      formError={formError}
      isSubmittingDriver={isSubmittingDriver}
      handleSaveDriver={handleSaveDriver}
      resetForm={resetForm}
    />
  );

  const riderForm = (
    <RiderWaitlistForm
      currentUser={currentUser}
      isCurrentUserWaiting={isCurrentUserWaiting}
      handleSaveRider={handleSaveRider}
      resetRiderForm={resetRiderForm}
    />
  );

  return (
    <SafeAreaProvider>
      <View style={appStyles.shell}>
        <StatusBar style="light" />

        <View style={appStyles.screen}>
          {activeTab === 'home' ? (
            <HomeScreen
              currentUser={currentUser}
              drivers={drivers}
              sortedDrivers={sortedDrivers}
              riders={riders}
              isBoardLoading={isBoardLoading}
              isRefreshing={isRefreshing}
              boardError={boardError}
              handleRefresh={handleRefresh}
              rideSortOrder={rideSortOrder}
              setRideSortOrder={setRideSortOrder}
              handleViewRideDetails={handleViewRideDetails}
              handleQuickRequest={handleQuickRequest}
              handleLeaveWaitlist={handleLeaveWaitlist}
              isAddingDriver={isAddingDriver}
              isAddingRider={isAddingRider}
              handleAddDriver={handleAddDriver}
              handleNeedRide={handleNeedRide}
              isCurrentUserWaiting={isCurrentUserWaiting}
              handleOpenProfile={handleOpenProfile}
              matchConfirmation={matchConfirmation}
              handleDismissMatchConfirmation={handleDismissMatchConfirmation}
              scrollViewRef={scrollViewRef}
              detailsView={detailsView}
              rideForm={rideForm}
              riderForm={riderForm}
            />
          ) : (
            <SafeAreaView style={appStyles.tabScreen} edges={['top']}>
              {activeTab === 'map' && <MapScreen onGoHome={handleGoHome} />}
              {activeTab === 'requests' && (
                <RequestsScreen currentUser={currentUser} onGoHome={handleGoHome} />
              )}
              {activeTab === 'profile' && (
                <ProfileScreen currentUser={currentUser} handleSignOut={handleSignOut} />
              )}
            </SafeAreaView>
          )}
        </View>

        <TabBar activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </SafeAreaProvider>
  );
}

const appStyles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screen: {
    flex: 1,
  },
  tabScreen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
