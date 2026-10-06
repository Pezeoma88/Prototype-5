import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../theme/legacyStyles';

// Rider "Request a Ride" panel: joins the (session-only) Looking for a Ride
// list. Replaced by persisted ride needs in a later phase. (Moved from
// App.js in Phase 1A.)
export default function RiderWaitlistForm({
  currentUser,
  isCurrentUserWaiting,
  handleSaveRider,
  resetRiderForm,
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <View style={[styles.sectionAccent, styles.sectionAccentRider]} />
        <Text style={styles.sectionTitle}>Request a Ride</Text>
      </View>

      {isCurrentUserWaiting ? (
        <Text style={styles.formHint}>
          You're already listed in Looking for a Ride as{' '}
          <Text style={styles.formHintStrong}>{currentUser.name}</Text>. To ask for a seat,
          open a ride in Available Rides and tap Request This Ride.
        </Text>
      ) : (
        <>
          <Text style={styles.formHint}>
            You'll be listed in Looking for a Ride as{' '}
            <Text style={styles.formHintStrong}>{currentUser.name}</Text> so drivers can see
            you need a lift. To ask for a seat on a specific ride, open it in Available
            Rides and tap Request This Ride.
          </Text>

          <TouchableOpacity
            style={styles.saveRiderButton}
            onPress={handleSaveRider}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Add Me to Looking for a Ride</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={resetRiderForm}
        activeOpacity={0.85}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
