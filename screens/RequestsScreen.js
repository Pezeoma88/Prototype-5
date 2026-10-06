import { ScrollView, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import EmptyState from '../components/EmptyState';
import { gutter, spacing } from '../theme/theme';

// Requests tab. Placeholder in Phase 1A: the Pending | Confirmed | Past view
// arrives with request expiry and past rides. Until then, requests are
// managed from each ride's details on the Home board, exactly as in
// Prototype 4.
export default function RequestsScreen({ currentUser, onGoHome }) {
  const message =
    currentUser.role === 'driver'
      ? 'Soon you will see every request for your rides here. For now, open one of your rides on the Home board to accept or deny requests.'
      : 'Soon you will see all your ride requests here. For now, open a ride on the Home board to see your request status.';
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader title="Requests" subtitle="Pending, confirmed, and past rides" />
      <EmptyState
        icon="file-tray-full-outline"
        title="Requests are moving here"
        message={message}
        actionLabel="Go to Home"
        onAction={onGoHome}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: gutter,
    paddingBottom: spacing.xxxl,
  },
});
