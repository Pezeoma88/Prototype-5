import { Keyboard, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../theme/legacyStyles';
import {
  DEPARTURE_MINUTE_INTERVAL,
  MAX_SEATS,
  MIN_SEATS,
  formatDeparture,
} from '../lib/format';

// Offer a Ride / Edit Ride form for Drivers. State, validation, and saving
// stay in App.js; this component only renders them. (Moved from App.js in
// Phase 1A.)
export default function RideForm({
  currentUser,
  editingRideId,
  editingDriver,
  destinationInput,
  setDestinationInput,
  departureAtInput,
  departurePickerMode,
  setDeparturePickerMode,
  departurePickerMinimumDate,
  handleToggleDeparturePicker,
  handleDeparturePicked,
  seatsInput,
  setSeatsInput,
  formError,
  isSubmittingDriver,
  handleSaveDriver,
  resetForm,
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <View style={[styles.sectionAccent, styles.sectionAccentDriver]} />
        <Text style={styles.sectionTitle}>
          {editingRideId !== null ? 'Edit Ride' : 'Offer a Ride'}
        </Text>
      </View>

      <Text style={styles.formHint}>
        {editingRideId !== null ? 'Editing as ' : 'Posting as '}
        <Text style={styles.formHintStrong}>{currentUser.name}</Text>
      </Text>

      <Text style={styles.authLabel}>Where are you going?</Text>
      <TextInput
        style={styles.input}
        placeholder="Destination (e.g. Campus Library)"
        placeholderTextColor="#9AA3B2"
        value={destinationInput}
        onChangeText={setDestinationInput}
        onFocus={() => setDeparturePickerMode(null)}
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
      />

      {/* Departure is picked on native scrolling wheels instead of typed:
          one wheel for the day and one for the time, combined into a
          single Date. On iPhone the wheels appear inline (spinner
          style); on Android the system date/time dialogs are used. */}
      <Text style={styles.authLabel}>When are you leaving?</Text>
      <View style={[styles.input, styles.departureDisplay]}>
        <Text
          style={
            departureAtInput !== null
              ? styles.departureDisplayText
              : styles.departureDisplayPlaceholder
          }
        >
          {departureAtInput !== null
            ? formatDeparture(departureAtInput)
            : 'Choose a departure date and time'}
        </Text>
      </View>
      <View style={styles.departureButtonRow}>
        {[
          { mode: 'date', label: 'Date' },
          { mode: 'time', label: 'Time' },
        ].map((option) => {
          const isActive = departurePickerMode === option.mode;
          return (
            <TouchableOpacity
              key={option.mode}
              style={[styles.departureButton, isActive && styles.departureButtonActive]}
              onPress={() => handleToggleDeparturePicker(option.mode)}
              activeOpacity={0.85}
            >
              <Text
                style={[styles.departureButtonText, isActive && styles.departureButtonTextActive]}
              >
                {isActive ? 'Done' : `Pick ${option.label}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {departurePickerMode !== null && departureAtInput !== null && (
        <View style={Platform.OS === 'ios' ? styles.departurePickerBox : null}>
          <DateTimePicker
            key={departurePickerMode}
            value={departureAtInput}
            mode={departurePickerMode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={departurePickerMinimumDate}
            minuteInterval={DEPARTURE_MINUTE_INTERVAL}
            themeVariant="light"
            textColor="#16213E"
            locale="en-US"
            onValueChange={(event, date) => handleDeparturePicked(date)}
            onDismiss={() => setDeparturePickerMode(null)}
          />
        </View>
      )}

      {/* iOS has no Return key on a number pad, but pairing
          returnKeyType="done" with a number-pad keyboardType makes iOS
          show its own native "Done" toolbar above the keyboard, which
          fires onSubmitEditing below. That's what actually dismisses
          the keyboard on a real device, so no custom accessory bar is
          rendered here. Digits are filtered as typed so only whole
          numbers land. */}
      <Text style={styles.authLabel}>How many seats can you offer?</Text>
      <TextInput
        style={styles.input}
        placeholder={`Open seats (${MIN_SEATS}–${MAX_SEATS})`}
        placeholderTextColor="#9AA3B2"
        value={seatsInput}
        onChangeText={(text) => setSeatsInput(text.replace(/[^0-9]/g, ''))}
        onFocus={() => setDeparturePickerMode(null)}
        keyboardType="number-pad"
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
      />
      {editingDriver !== null && editingDriver.matchedRiders.length > 0 && (
        <Text style={styles.formHint}>
          {editingDriver.matchedRiders.length} confirmed rider
          {editingDriver.matchedRiders.length === 1 ? '' : 's'} — total seats can't go
          below that.
        </Text>
      )}

      {formError !== '' && <Text style={styles.errorText}>{formError}</Text>}

      <TouchableOpacity
        style={[styles.saveDriverButton, isSubmittingDriver && styles.rideCardButtonDisabled]}
        onPress={handleSaveDriver}
        disabled={isSubmittingDriver}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>
          {editingRideId !== null ? 'Save Changes' : 'Post Ride'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={resetForm}
        activeOpacity={0.85}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
