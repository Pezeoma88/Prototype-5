import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import styles from '../theme/legacyStyles';
import { getInitial } from '../lib/format';
import { gutter, spacing } from '../theme/theme';

// Profile tab: the signed-in account's name, email, role, and Log Out.
// (Moved from App.js in Phase 1A; editable profiles arrive in a later phase.)
export default function ProfileScreen({ currentUser, handleSignOut }) {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: gutter, paddingBottom: spacing.xxxl }}>
      <ScreenHeader title="Profile" subtitle="Your CarpoolBoard account" />
      <View style={styles.detailsWrap}>
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeaderRow}>
            <View style={styles.avatarRing}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitial(currentUser.name)}</Text>
              </View>
            </View>
            <View style={styles.detailsHeaderText}>
              <Text style={styles.detailsDriverName}>{currentUser.name}</Text>
              <Text style={styles.detailsHeaderHint}>Account</Text>
            </View>
          </View>

          <View style={styles.confirmationDetailsBox}>
            <View style={styles.confirmationDetailRow}>
              <Text style={styles.confirmationDetailLabel}>Name</Text>
              <Text style={styles.confirmationDetailValue}>{currentUser.name}</Text>
            </View>
            <View style={styles.confirmationDetailDivider} />
            <View style={styles.confirmationDetailRow}>
              <Text style={styles.confirmationDetailLabel}>Email</Text>
              <Text style={styles.confirmationDetailValue}>{currentUser.email}</Text>
            </View>
            <View style={styles.confirmationDetailDivider} />
            <View style={styles.confirmationDetailRow}>
              <Text style={styles.confirmationDetailLabel}>Role</Text>
              <View
                style={[
                  styles.roleBadge,
                  currentUser.role === 'driver'
                    ? styles.roleBadgeInlineDriver
                    : styles.roleBadgeInlineRider,
                ]}
              >
                <Text style={styles.roleBadgeText}>
                  {currentUser.role === 'driver' ? 'Driver' : 'Rider'}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.authDisclaimer}>
            This account is a class-project prototype: it's saved in CarpoolBoard's shared
            database, with no password or real authentication yet.
          </Text>

          <TouchableOpacity
            style={styles.cancelRideButton}
            onPress={handleSignOut}
            activeOpacity={0.85}
          >
            <Text style={styles.cancelRideButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
