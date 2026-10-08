import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import AppButton from '../components/AppButton';
import Avatar from '../components/Avatar';
import BackHeader from '../components/BackHeader';
import FormSection from '../components/FormSection';
import Notice from '../components/Notice';
import TextField from '../components/TextField';
import { BIO_MAX_LENGTH, NAME_MAX_LENGTH, VEHICLE_MAX_LENGTH } from '../lib/format';
import { colors, gutter, spacing, typography } from '../theme/theme';

// Edit Profile, opened from the Profile tab. One form for the whole person:
// General (name, email, bio) and the optional Driver information (vehicle
// make/model), which stays saved while the person uses Rider mode. State,
// validation, and saving stay in App.js; this screen only renders them.
//
// The profile photo is picked from the photo library (square crop) and
// previewed here; App uploads it to Supabase Storage only on Save Changes.
// License plates aren't collected at all in this prototype.
export default function EditProfileScreen({
  activeMode,
  currentPhotoUri,
  profilePhotoDraft,
  profilePhotoError,
  isPickingPhoto,
  handlePickProfilePhoto,
  handleDiscardProfilePhoto,
  profileNameInput,
  setProfileNameInput,
  profileEmailInput,
  setProfileEmailInput,
  profileBioInput,
  setProfileBioInput,
  profileVehicleInput,
  setProfileVehicleInput,
  profileFormError,
  isSavingProfile,
  handleSaveProfile,
  resetProfileForm,
}) {
  // The picked-but-unsaved photo, else the saved one, else initials.
  const previewUri = profilePhotoDraft ? profilePhotoDraft.uri : currentPhotoUri;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <BackHeader
          backLabel="Cancel"
          onBack={resetProfileForm}
          title="Edit Profile"
          subtitle="One profile for both Driver and Rider mode."
        />

        {/* Photo: tap the avatar (or the button) to pick from the library.
            A picked photo is only a preview until Save Changes. */}
        <View style={styles.photoRow}>
          <Pressable
            onPress={handlePickProfilePhoto}
            disabled={isPickingPhoto || isSavingProfile}
            accessibilityRole="button"
            accessibilityLabel="Choose a profile photo"
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Avatar name={profileNameInput} role={activeMode} uri={previewUri} size={72} ring />
            <View style={styles.photoBadge}>
              <Ionicons name="images" size={13} color={colors.textOnAccent} />
            </View>
          </Pressable>
          <View style={styles.photoText}>
            <Text style={styles.photoTitle}>Profile photo</Text>
            <Text style={styles.photoDetail}>
              {profilePhotoDraft
                ? 'New photo selected. It uploads when you tap Save Changes.'
                : 'Choose a JPEG or PNG from your photo library (up to 2 MB).'}
            </Text>
            <View style={styles.photoActions}>
              <AppButton
                title={previewUri ? 'Change Photo' : 'Choose Photo'}
                icon="images-outline"
                variant="secondary"
                size="sm"
                onPress={handlePickProfilePhoto}
                loading={isPickingPhoto}
                disabled={isSavingProfile}
              />
              {profilePhotoDraft && (
                <Pressable
                  onPress={handleDiscardProfilePhoto}
                  disabled={isSavingProfile}
                  hitSlop={8}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.discard, pressed && styles.pressed]}
                >
                  <Text style={styles.discardText}>Keep Current</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
        {profilePhotoError !== '' && (
          <Notice message={profilePhotoError} tone="danger" style={styles.photoError} />
        )}

        <FormSection title="General" icon="person-circle-outline">
          <TextField
            label="Display name"
            icon="person-outline"
            placeholder="e.g. Jordan Smith"
            value={profileNameInput}
            onChangeText={setProfileNameInput}
            maxLength={NAME_MAX_LENGTH}
            autoCapitalize="words"
            textContentType="name"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />
          <TextField
            label="Email"
            icon="mail-outline"
            placeholder="e.g. jordan@example.edu"
            value={profileEmailInput}
            onChangeText={setProfileEmailInput}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            hint="This is how you sign in. If you change it, sign in with the new email next time — the old one won’t find your account."
          />
          <TextField
            label="Bio"
            icon="chatbubble-ellipses-outline"
            placeholder="A line or two about you (e.g. major, usual routes)"
            value={profileBioInput}
            onChangeText={setProfileBioInput}
            multiline
            numberOfLines={3}
            maxLength={BIO_MAX_LENGTH}
            returnKeyType="done"
            blurOnSubmit
            onSubmitEditing={Keyboard.dismiss}
            hint={`Optional · ${profileBioInput.length}/${BIO_MAX_LENGTH}`}
            style={styles.lastField}
          />
        </FormSection>

        <FormSection title="Driver information" icon="car-sport-outline" tint={colors.driver}>
          <TextField
            label="Vehicle make/model"
            icon="car-outline"
            placeholder="e.g. Honda Civic"
            value={profileVehicleInput}
            onChangeText={setProfileVehicleInput}
            maxLength={VEHICLE_MAX_LENGTH}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            hint="Optional, and only needed for driving. It stays saved while you use Rider mode."
            style={styles.lastField}
          />
          <View style={styles.privacyRow}>
            <Ionicons name="lock-closed-outline" size={16} color={colors.textMuted} />
            <View style={styles.privacyText}>
              <Text style={styles.privacyTitle}>License plate</Text>
              <Text style={styles.privacyDetail}>
                Not collected. Sharing a plate only with confirmed riders needs secure sign-in, which
                this prototype doesn&apos;t have yet.
              </Text>
            </View>
          </View>
        </FormSection>

        {profileFormError !== '' && <Notice message={profileFormError} tone="danger" style={styles.error} />}

        <AppButton
          title="Save Changes"
          icon="checkmark-circle-outline"
          onPress={handleSaveProfile}
          loading={isSavingProfile}
          style={styles.submit}
        />
        <AppButton title="Cancel" variant="secondary" onPress={resetProfileForm} disabled={isSavingProfile} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: gutter,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  photoText: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  photoTitle: {
    ...typography.bodyStrong,
    color: colors.text,
  },
  photoDetail: {
    ...typography.caption,
    color: colors.textFaint,
    marginTop: 2,
    lineHeight: 17,
  },
  photoBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  discard: {
    paddingVertical: spacing.xs,
  },
  discardText: {
    ...typography.label,
    color: colors.textMuted,
  },
  photoError: {
    marginBottom: spacing.lg,
  },
  pressed: {
    opacity: 0.7,
  },
  lastField: {
    marginBottom: 0,
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
    lineHeight: 17,
  },
  error: {
    marginTop: spacing.xs,
  },
  submit: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
});
