import { StatusBar } from 'expo-status-bar';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../theme/legacyStyles';

// Sign-in screen: accounts are `profiles` rows in Supabase (no passwords).
// Email is the account identifier; picking a name + role only applies the
// first time an email is used. All state and the sign-in logic stay in
// App.js; this screen only renders them. (Moved from App.js in Phase 1A.)
export default function SignInScreen({
  authEmailInput,
  setAuthEmailInput,
  matchingAuthAccount,
  authNameInput,
  setAuthNameInput,
  authRole,
  setAuthRole,
  authError,
  isSigningIn,
  handleSignIn,
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.authFlexWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.authScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.authHeader}>
              <View style={styles.logoMark}>
                <Text style={styles.logoMarkText}>C</Text>
              </View>
              <Text style={styles.authTitle}>CarpoolBoard</Text>
              <Text style={styles.authSubtitle}>Sign in to see the shared ride board.</Text>
            </View>

            <View style={styles.authCard}>
              <Text style={styles.authLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. jordan@example.edu"
                placeholderTextColor="#9AA3B2"
                value={authEmailInput}
                onChangeText={setAuthEmailInput}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />

              {matchingAuthAccount ? (
                <View style={styles.authReturningNotice}>
                  <Text style={styles.authReturningNoticeText}>
                    Welcome back, {matchingAuthAccount.name}! You'll log back in as{' '}
                    {matchingAuthAccount.role === 'driver' ? 'a Driver' : 'a Rider'}.
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={styles.authLabel}>Your name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Jordan Smith"
                    placeholderTextColor="#9AA3B2"
                    value={authNameInput}
                    onChangeText={setAuthNameInput}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                  />

                  <Text style={styles.authLabel}>I am a...</Text>
                  <View style={styles.roleToggleRow}>
                    <TouchableOpacity
                      style={[
                        styles.roleToggleButton,
                        authRole === 'driver' && styles.roleToggleButtonActiveDriver,
                      ]}
                      onPress={() => setAuthRole('driver')}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.roleToggleText,
                          authRole === 'driver' && styles.roleToggleTextActive,
                        ]}
                      >
                        Driver
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.roleToggleButton,
                        authRole === 'rider' && styles.roleToggleButtonActiveRider,
                      ]}
                      onPress={() => setAuthRole('rider')}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.roleToggleText,
                          authRole === 'rider' && styles.roleToggleTextActive,
                        ]}
                      >
                        Rider
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              <Text style={styles.authHint}>
                New here? Enter your name and pick a role. Already signed up? Just enter the
                same email — your name and role are saved with it.
              </Text>

              {authError !== '' && <Text style={styles.errorText}>{authError}</Text>}

              <TouchableOpacity
                style={[styles.saveDriverButton, isSigningIn && styles.rideCardButtonDisabled]}
                onPress={handleSignIn}
                disabled={isSigningIn}
                activeOpacity={0.85}
              >
                <Text style={[styles.buttonText, isSigningIn && styles.rideCardButtonTextDisabled]}>
                  {isSigningIn ? 'Signing in…' : 'Continue'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.authDisclaimer}>
                This is a class-project prototype login: your name, email, and role are saved to
                CarpoolBoard's shared database, with no password and no real security. Anyone
                who enters your email can sign in as you. Don't use a real/sensitive password
                anywhere here.
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
