import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Avatar from '../components/Avatar';
import AppButton from '../components/AppButton';
import Badge from '../components/Badge';
import FormSection from '../components/FormSection';
import InfoRow from '../components/InfoRow';
import { colors, gutter, radius, roleColor, spacing, typography } from '../theme/theme';

// Profile tab, laid out for the full Prototype 5 profile (photo, bio,
// vehicle, ratings, reviews). Only name, email, and role exist in Supabase
// today, so everything else shows an honest placeholder: nothing here is
// made up. Vehicle, license, and reviews are Driver-only; Riders get a
// "Looking for a Ride" card instead.
export default function ProfileScreen({ currentUser, handleSignOut }) {
  const isDriver = currentUser.role === 'driver';
  const tint = roleColor(currentUser.role);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={[styles.glow, { backgroundColor: `${tint}1F` }]} />
        <Avatar name={currentUser.name} role={currentUser.role} size={96} ring />
        <Text style={styles.name} numberOfLines={2}>
          {currentUser.name}
        </Text>
        <Badge
          label={isDriver ? 'Driver' : 'Rider'}
          tone={isDriver ? 'driver' : 'rider'}
          style={styles.roleBadge}
        />
        {isDriver && (
          <View style={styles.ratingRow}>
            <Ionicons name="star-outline" size={15} color={colors.textMuted} />
            <Text style={styles.ratingText}>No ratings yet</Text>
          </View>
        )}
        <AppButton
          title="Edit Profile"
          icon="create-outline"
          variant="secondary"
          size="sm"
          disabled
          style={styles.editButton}
        />
        <Text style={styles.editHint}>Profile editing and photos are coming in the profile update.</Text>
      </View>

      {/* About */}
      <FormSection title="About" icon="person-circle-outline" tint={tint}>
        <PlaceholderText icon="add-circle-outline" text="Add a bio" detail="Tell riders and drivers a little about yourself." />
      </FormSection>

      {isDriver ? (
        <>
          {/* Vehicle (Driver only) */}
          <FormSection title="Vehicle" icon="car-sport-outline" tint={tint}>
            <PlaceholderText
              icon="car-outline"
              text="Vehicle information coming in the profile update"
              detail="Your car’s make and model will show on your ride cards."
            />
            <View style={styles.privacyRow}>
              <Ionicons name="lock-closed-outline" size={16} color={colors.textMuted} />
              <View style={styles.privacyText}>
                <Text style={styles.privacyTitle}>License plate</Text>
                <Text style={styles.privacyDetail}>
                  Only shown to riders with a confirmed seat on your ride.
                </Text>
              </View>
            </View>
          </FormSection>

          {/* Reviews (Driver only) */}
          <FormSection title="Reviews" icon="star-outline" tint={tint}>
            <PlaceholderText
              icon="chatbubbles-outline"
              text="No reviews yet"
              detail="Riders who complete a trip with you will be able to rate it."
            />
          </FormSection>
        </>
      ) : (
        /* Looking for a Ride (Rider only) */
        <FormSection title="Looking for a Ride" icon="walk" tint={tint}>
          <PlaceholderText
            icon="navigate-circle-outline"
            text="No ride posts yet"
            detail="Soon you’ll be able to post where you need to go and when."
          />
        </FormSection>
      )}

      {/* Account */}
      <FormSection title="Account" icon="settings-outline" tint={colors.textMuted}>
        <InfoRow icon="person-outline" label="Name" value={currentUser.name} />
        <InfoRow icon="mail-outline" label="Email" value={currentUser.email} divider />
        <InfoRow
          icon={isDriver ? 'car-sport-outline' : 'walk-outline'}
          label="Role"
          divider
          right={
            <View style={styles.rightAlign}>
              <Badge label={isDriver ? 'Driver' : 'Rider'} tone={isDriver ? 'driver' : 'rider'} />
            </View>
          }
        />
      </FormSection>

      <Text style={styles.disclaimer}>
        This account is a class-project prototype: it&apos;s saved in CarpoolBoard&apos;s shared
        database, with no password or real authentication yet.
      </Text>

      <AppButton title="Log Out" icon="log-out-outline" variant="destructive" onPress={handleSignOut} />
    </ScrollView>
  );
}

// Muted "nothing here yet" line used inside profile cards.
function PlaceholderText({ icon, text, detail }) {
  return (
    <View style={styles.placeholder}>
      <View style={styles.placeholderIcon}>
        <Ionicons name={icon} size={18} color={colors.textMuted} />
      </View>
      <View style={styles.placeholderBody}>
        <Text style={styles.placeholderText}>{text}</Text>
        {detail ? <Text style={styles.placeholderDetail}>{detail}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: gutter,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  hero: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  glow: {
    position: 'absolute',
    top: 0,
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  name: {
    ...typography.heading,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  roleBadge: {
    alignSelf: 'center',
    marginTop: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  ratingText: {
    ...typography.label,
    color: colors.textMuted,
    marginLeft: 5,
  },
  editButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  editHint: {
    ...typography.caption,
    color: colors.textFaint,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  placeholder: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  placeholderIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  placeholderBody: {
    flex: 1,
  },
  placeholderText: {
    ...typography.bodyStrong,
    color: colors.textMuted,
  },
  placeholderDetail: {
    ...typography.caption,
    color: colors.textFaint,
    marginTop: 2,
    lineHeight: 17,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  privacyText: {
    flex: 1,
    marginLeft: 10,
  },
  privacyTitle: {
    ...typography.label,
    color: colors.text,
  },
  privacyDetail: {
    ...typography.caption,
    color: colors.textFaint,
    marginTop: 2,
  },
  rightAlign: {
    flex: 1,
    alignItems: 'flex-end',
  },
  disclaimer: {
    ...typography.caption,
    color: colors.textFaint,
    lineHeight: 17,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
});
