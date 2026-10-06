import { ScrollView, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import EmptyState from '../components/EmptyState';
import { gutter, spacing } from '../theme/theme';

// Map tab. Placeholder in Phase 1A: the real map (ride pickup pins and a
// floating ride card) comes in the Map phase, once rides have pickup
// locations.
export default function MapScreen({ onGoHome }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScreenHeader title="Map" subtitle="See where rides are leaving from" />
      <EmptyState
        icon="map-outline"
        title="Map coming soon"
        message="Rides will appear here as pins at their pickup spots. For now, browse rides on the Home board."
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
