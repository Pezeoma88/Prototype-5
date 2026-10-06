import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../theme/legacyStyles';
import { RIDE_SORT_OPTIONS, getInitial } from '../lib/format';

// Home tab: the shared CarpoolBoard (Available Rides + Looking for a Ride),
// plus the Offer a Ride / Request a Ride forms and Ride Details. State and
// Supabase logic stay in App.js. App passes the details view and the two
// forms in as ready-made elements so this screen only arranges them.
// (Moved from App.js in Phase 1A; restyled in Phase 1B.)
//
// This screen applies its own top safe-area inset (instead of App doing it)
// so the KeyboardAvoidingView below measures its position from the top of
// the screen and lifts forms the right amount above the keyboard.
export default function HomeScreen({
  currentUser,
  drivers,
  sortedDrivers,
  riders,
  isBoardLoading,
  isRefreshing,
  boardError,
  handleRefresh,
  rideSortOrder,
  setRideSortOrder,
  handleViewRideDetails,
  handleLeaveWaitlist,
  showActionsRow,
  isAddingDriver,
  isAddingRider,
  handleAddDriver,
  handleNeedRide,
  isCurrentUserWaiting,
  handleSignOut,
  matchConfirmation,
  handleDismissMatchConfirmation,
  scrollViewRef,
  detailsView,
  rideForm,
  riderForm,
}) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Dark navy header: text + shape based branding, no emoji */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoMark}>
            <Text style={styles.logoMarkText}>C</Text>
          </View>
          <View style={styles.brandTextGroup}>
            <Text style={styles.brandTitle}>CarpoolBoard</Text>
            <Text style={styles.brandTagline}>Share the ride. Split the drive.</Text>
          </View>
        </View>

        <View style={styles.accountRow}>
          <Text style={styles.accountText} numberOfLines={1}>
            Signed in as <Text style={styles.accountTextStrong}>{currentUser.name}</Text>
          </Text>
          <View
            style={[
              styles.roleBadge,
              currentUser.role === 'driver' ? styles.roleBadgeDriver : styles.roleBadgeRider,
            ]}
          >
            <Text style={styles.roleBadgeText}>
              {currentUser.role === 'driver' ? 'Driver' : 'Rider'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleSignOut}
            activeOpacity={0.7}
            style={styles.accountActionButton}
          >
            <Text style={styles.logOutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statChip}>
            <Text style={styles.statChipNumber}>{drivers.length}</Text>
            <Text style={styles.statChipLabel}>Drivers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Text style={styles.statChipNumber}>{riders.length}</Text>
            <Text style={styles.statChipLabel}>Riders Waiting</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.mainFlexWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollArea}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#3B6EF5"
                colors={['#3B6EF5']}
              />
            }
          >
            {matchConfirmation ? (
              /* Match Confirmed screen: shown after a rider is matched to a driver */
              <View style={styles.confirmationWrap}>
                <View style={styles.confirmationCard}>
                  <View style={styles.confirmationIconCircle}>
                    <Text style={styles.confirmationIcon}>✓</Text>
                  </View>

                  <Text style={styles.confirmationTitle}>Ride Matched!</Text>
                  <Text style={styles.confirmationSubtitle}>
                    {matchConfirmation.riderName} has been matched with {matchConfirmation.driverName}
                    &apos;s ride.
                  </Text>

                  <View style={styles.confirmationDetailsBox}>
                    <View style={styles.confirmationDetailRow}>
                      <Text style={styles.confirmationDetailLabel}>Rider</Text>
                      <Text style={styles.confirmationDetailValue}>
                        {matchConfirmation.riderName}
                      </Text>
                    </View>
                    <View style={styles.confirmationDetailDivider} />
                    <View style={styles.confirmationDetailRow}>
                      <Text style={styles.confirmationDetailLabel}>Driver</Text>
                      <Text style={styles.confirmationDetailValue}>
                        {matchConfirmation.driverName}
                      </Text>
                    </View>
                    <View style={styles.confirmationDetailDivider} />
                    <View style={styles.confirmationDetailRow}>
                      <Text style={styles.confirmationDetailLabel}>Destination</Text>
                      <Text style={styles.confirmationDetailValue}>
                        {matchConfirmation.destination}
                      </Text>
                    </View>
                    <View style={styles.confirmationDetailDivider} />
                    <View style={styles.confirmationDetailRow}>
                      <Text style={styles.confirmationDetailLabel}>Departs</Text>
                      <Text style={styles.confirmationDetailValue}>
                        {matchConfirmation.departureTime}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.saveDriverButton, styles.confirmationDoneButton]}
                    onPress={handleDismissMatchConfirmation}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.buttonText}>Back to Rides</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : detailsView ? (
              /* Ride Details screen: shown after selecting a ride from Available Rides */
              detailsView
            ) : (
              <>
                {/* Available Rides section (drivers) */}
                <View style={styles.sectionHeaderRow}>
                  <View style={[styles.sectionAccent, styles.sectionAccentDriver]} />
                  <Text style={styles.sectionTitle}>Available Rides</Text>
                </View>

                {/* Sort control: only useful once there's more than one ride. */}
                {drivers.length > 1 && (
                  <View style={styles.sortRow}>
                    <Text style={styles.sortLabel}>Sort by</Text>
                    {RIDE_SORT_OPTIONS.map((option) => {
                      const isActive = rideSortOrder === option.key;
                      return (
                        <TouchableOpacity
                          key={option.key}
                          style={[styles.sortOption, isActive && styles.sortOptionActive]}
                          onPress={() => setRideSortOrder(option.key)}
                          activeOpacity={0.85}
                        >
                          <Text style={[styles.sortOptionText, isActive && styles.sortOptionTextActive]}>
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* A failed load keeps any rides already shown; this just explains why
                    they may be out of date. */}
                {boardError !== '' && (
                  <View style={styles.noticeBox}>
                    <Text style={styles.noticeText}>{boardError}</Text>
                  </View>
                )}

                {drivers.length === 0 && isBoardLoading ? (
                  <View style={styles.emptyCard}>
                    <ActivityIndicator color="#3B6EF5" />
                    <Text style={[styles.emptyMessage, styles.loadingMessage]}>Loading rides…</Text>
                  </View>
                ) : drivers.length === 0 && boardError !== '' ? (
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyMessage}>Rides couldn't be loaded.</Text>
                  </View>
                ) : drivers.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyMessage}>No rides posted yet.</Text>
                  </View>
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.rideCarousel}
                  >
                    {sortedDrivers.map((driver) => (
                      <TouchableOpacity
                        key={driver.id}
                        style={styles.rideCard}
                        onPress={() => handleViewRideDetails(driver.id)}
                        activeOpacity={0.85}
                      >
                        <View style={styles.rideCardTop}>
                          <View style={styles.avatarRing}>
                            <View style={styles.avatar}>
                              <Text style={styles.avatarText}>{getInitial(driver.name)}</Text>
                            </View>
                          </View>
                          <View style={[styles.seatBadge, driver.seats === 0 && styles.seatBadgeFull]}>
                            <Text style={[styles.seatBadgeText, driver.seats === 0 && styles.seatBadgeTextFull]}>
                              {driver.seats === 0 ? 'Full' : `${driver.seats} seat${driver.seats === 1 ? '' : 's'}`}
                            </Text>
                          </View>
                        </View>

                        {driver.driverAccountId === currentUser.id && (
                          <Text style={styles.yourRideTag}>Your Ride</Text>
                        )}
                        <Text style={styles.rideCardName}>{driver.name}</Text>

                        <View style={styles.rideCardRouteRow}>
                          <Text style={styles.rideCardRouteIcon}>→</Text>
                          <Text style={styles.rideCardDestination} numberOfLines={1}>
                            {driver.destination}
                          </Text>
                        </View>

                        <View style={styles.rideCardTimeBadge}>
                          <Text style={styles.rideCardTimeText}>Departs {driver.departureTime}</Text>
                        </View>

                        <Text style={styles.rideCardCounts}>
                          {driver.pendingRequests.length} pending · {driver.matchedRiders.length} confirmed
                        </Text>

                        <View style={styles.rideCardButton}>
                          <Text style={styles.rideCardButtonText}>View Details</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}

                {/* Looking for a Ride section (riders) */}
                <View style={styles.sectionHeaderRow}>
                  <View style={[styles.sectionAccent, styles.sectionAccentRider]} />
                  <Text style={styles.sectionTitle}>Looking for a Ride</Text>
                </View>

                {riders.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Text style={styles.emptyMessage}>No riders waiting.</Text>
                  </View>
                ) : (
                  <View style={styles.riderChipRow}>
                    {riders.map((rider) => {
                      const isSelf = currentUser.role === 'rider' && rider.id === currentUser.id;
                      return (
                        <View key={rider.id} style={styles.riderChip}>
                          <View style={[styles.avatar, styles.riderAvatar, styles.riderChipAvatar]}>
                            <Text style={styles.avatarText}>{getInitial(rider.name)}</Text>
                          </View>
                          <Text style={styles.riderChipName}>{rider.name}</Text>
                          {isSelf && (
                            <TouchableOpacity
                              style={styles.riderChipLeaveButton}
                              onPress={() => handleLeaveWaitlist(rider.id)}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.riderChipLeaveText}>Remove</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}

                {/* Primary actions: side-by-side quick-action cards */}
                {showActionsRow && (
                  <View style={styles.actionsRow}>
                    {currentUser.role === 'driver' && !isAddingDriver && (
                      <TouchableOpacity
                        style={[styles.actionCard, styles.actionCardDriver]}
                        onPress={handleAddDriver}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.actionCardLabel}>Offer a Ride</Text>
                        <Text style={styles.actionCardHint}>Have extra seats?</Text>
                      </TouchableOpacity>
                    )}
                    {currentUser.role === 'rider' && !isAddingRider && (
                      <TouchableOpacity
                        style={[styles.actionCard, styles.actionCardRider]}
                        onPress={handleNeedRide}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.actionCardLabel}>Request a Ride</Text>
                        <Text style={styles.actionCardHint}>
                          {isCurrentUserWaiting ? "You're on the list" : 'Need a lift?'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {/* Offer a Ride / Edit Ride form */}
                {currentUser.role === 'driver' && isAddingDriver && rideForm}

                {/* Request a Ride form */}
                {currentUser.role === 'rider' && isAddingRider && riderForm}
              </>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
