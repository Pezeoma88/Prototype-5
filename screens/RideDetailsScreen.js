import { Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../theme/legacyStyles';
import { getInitial } from '../lib/format';

// Ride Details: shown after selecting a ride from Available Rides. Shows
// pending requests (with Accept/Deny for the ride's driver), confirmed
// passengers, and the rider's Request / Leave actions. All logic lives in
// App.js and arrives as props. (Moved from App.js in Phase 1A.)
export default function RideDetailsScreen({
  detailsDriver,
  currentUser,
  requestNotice,
  isOwnerDriver,
  isOwnDetailsRide,
  reservingDriverId,
  requestReasonInput,
  setRequestReasonInput,
  handleBackToAvailableRides,
  handleAcceptRequest,
  handleDenyRequest,
  handleCancelConfirmedSeat,
  handleBeginRequest,
  handleRequestRide,
  handleCancelReserve,
  handleStartEditRide,
  handleCancelRide,
}) {
  return (
    <View style={styles.detailsWrap}>
      <View style={styles.detailsCard}>
        <TouchableOpacity
          style={styles.detailsBackRow}
          onPress={handleBackToAvailableRides}
          activeOpacity={0.7}
        >
          <Text style={styles.detailsBackArrow}>‹</Text>
          <Text style={styles.detailsBackText}>Available Rides</Text>
        </TouchableOpacity>

        <View style={styles.detailsHeaderRow}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitial(detailsDriver.name)}</Text>
            </View>
          </View>
          <View style={styles.detailsHeaderText}>
            <Text style={styles.detailsDriverName}>{detailsDriver.name}</Text>
            <Text style={styles.detailsHeaderHint}>Ride Details</Text>
          </View>
        </View>

        <View style={styles.confirmationDetailsBox}>
          <View style={styles.confirmationDetailRow}>
            <Text style={styles.confirmationDetailLabel}>Destination</Text>
            <Text style={styles.confirmationDetailValue}>{detailsDriver.destination}</Text>
          </View>
          <View style={styles.confirmationDetailDivider} />
          <View style={styles.confirmationDetailRow}>
            <Text style={styles.confirmationDetailLabel}>Departs</Text>
            <Text style={styles.confirmationDetailValue}>{detailsDriver.departureTime}</Text>
          </View>
          <View style={styles.confirmationDetailDivider} />
          <View style={styles.confirmationDetailRow}>
            <Text style={styles.confirmationDetailLabel}>Available Seats</Text>
            {detailsDriver.seats === 0 ? (
              <View style={styles.fullPill}>
                <Text style={styles.fullPillText}>Full</Text>
              </View>
            ) : (
              <Text style={styles.confirmationDetailValue}>{detailsDriver.seats}</Text>
            )}
          </View>
        </View>

        {requestNotice !== '' && (
          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>{requestNotice}</Text>
          </View>
        )}

        <View style={styles.sectionHeaderRow}>
          <View style={[styles.sectionAccent, styles.sectionAccentRider]} />
          <Text style={styles.sectionTitle}>
            Pending requests ({detailsDriver.pendingRequests.length})
          </Text>
        </View>

        {detailsDriver.pendingRequests.length === 0 ? (
          <Text style={styles.detailsMatchedEmpty}>No pending requests.</Text>
        ) : (
          <View style={styles.pendingList}>
            {detailsDriver.pendingRequests.map((request) => (
              <View key={request.id} style={styles.pendingRow}>
                <View style={[styles.avatar, styles.riderAvatar, styles.riderPickAvatar]}>
                  <Text style={styles.avatarText}>{getInitial(request.name)}</Text>
                </View>
                <View style={styles.pendingInfo}>
                  <Text style={styles.riderPickName}>{request.name}</Text>
                  <Text style={styles.pendingStatus}>Pending</Text>
                  {request.reason ? (
                    <Text style={styles.pendingReasonText} numberOfLines={2}>
                      “{request.reason}”
                    </Text>
                  ) : null}
                </View>
                {isOwnerDriver && (
                  <>
                    {/* Never offer "Accept" on a request from the
                        ride's own driver: they can't be their own
                        passenger. */}
                    {request.riderId !== detailsDriver.driverAccountId && (
                    <TouchableOpacity
                      style={[
                        styles.acceptButton,
                        detailsDriver.seats === 0 && styles.rideCardButtonDisabled,
                      ]}
                      onPress={() => handleAcceptRequest(detailsDriver.id, request.id)}
                      disabled={detailsDriver.seats === 0}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.acceptButtonText,
                          detailsDriver.seats === 0 && styles.rideCardButtonTextDisabled,
                        ]}
                      >
                        {detailsDriver.seats === 0 ? 'Full' : 'Accept'}
                      </Text>
                    </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.denyButton}
                      onPress={() => handleDenyRequest(detailsDriver.id, request.id)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.denyButtonText}>Deny</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.sectionHeaderRow}>
          <View style={[styles.sectionAccent, styles.sectionAccentDriver]} />
          <Text style={styles.sectionTitle}>
            Confirmed passengers ({detailsDriver.matchedRiders.length})
          </Text>
        </View>

        {detailsDriver.matchedRiders.length === 0 ? (
          <Text style={styles.detailsMatchedEmpty}>No confirmed passengers yet.</Text>
        ) : (
          <View style={styles.riderChipRow}>
            {detailsDriver.matchedRiders.map((rider) => {
              const isSelf = currentUser.role === 'rider' && rider.id === currentUser.id;
              return (
                <View key={rider.id} style={styles.riderChip}>
                  <View style={[styles.avatar, styles.riderChipAvatar]}>
                    <Text style={styles.avatarText}>{getInitial(rider.name)}</Text>
                  </View>
                  <Text style={styles.riderChipName}>{rider.name}</Text>
                  {isSelf && (
                    <TouchableOpacity
                      style={styles.riderChipLeaveButton}
                      onPress={() => handleCancelConfirmedSeat(detailsDriver.id, rider.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.riderChipLeaveText}>Leave</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Requesting is hidden entirely on your own ride, so nobody can
            request a seat from themselves. */}
        {currentUser.role === 'rider' &&
          !isOwnDetailsRide &&
          (reservingDriverId === detailsDriver.id ? (
            /* Rider Matching: the signed-in rider confirms their own request. */
            <View style={styles.reservationPanel}>
              <Text style={styles.reservationTitle}>
                Request {detailsDriver.name}&apos;s ride
              </Text>
              <Text style={styles.reservationSubtitle}>
                Send this request as {currentUser.name}. The driver will accept or deny it.
              </Text>

              <TextInput
                style={[styles.input, styles.reasonInput]}
                placeholder='Optional: why do you need this ride? (e.g. "Going to campus")'
                placeholderTextColor="#9AA3B2"
                value={requestReasonInput}
                onChangeText={setRequestReasonInput}
                multiline
                numberOfLines={2}
                maxLength={140}
                returnKeyType="done"
                blurOnSubmit
                onSubmitEditing={Keyboard.dismiss}
              />

              <TouchableOpacity
                style={styles.saveRiderButton}
                onPress={() => handleRequestRide(detailsDriver.id, currentUser.id, requestReasonInput)}
                activeOpacity={0.85}
              >
                <Text style={styles.buttonText}>Confirm Request</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelReserve}
                activeOpacity={0.85}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            (() => {
              const alreadyConfirmed = detailsDriver.matchedRiders.some(
                (r) => r.id === currentUser.id
              );
              const alreadyPending = detailsDriver.pendingRequests.some(
                (req) => req.riderId === currentUser.id
              );

              let reserveLabel = 'Request This Ride';
              if (detailsDriver.seats === 0) {
                reserveLabel = 'Full';
              } else if (alreadyConfirmed) {
                reserveLabel = 'Already Confirmed';
              } else if (alreadyPending) {
                reserveLabel = 'Request Pending';
              }
              const reserveDisabled =
                detailsDriver.seats === 0 || alreadyConfirmed || alreadyPending;

              return (
                <TouchableOpacity
                  style={[
                    styles.saveDriverButton,
                    reserveDisabled && styles.rideCardButtonDisabled,
                  ]}
                  onPress={() => handleBeginRequest(detailsDriver.id)}
                  disabled={reserveDisabled}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      reserveDisabled && styles.rideCardButtonTextDisabled,
                    ]}
                  >
                    {reserveLabel}
                  </Text>
                </TouchableOpacity>
              );
            })()
          ))}

        {isOwnerDriver && (
          <TouchableOpacity
            style={styles.editRideButton}
            onPress={() => handleStartEditRide(detailsDriver.id)}
            activeOpacity={0.85}
          >
            <Text style={styles.editRideButtonText}>Edit Ride</Text>
          </TouchableOpacity>
        )}

        {isOwnerDriver && (
          <TouchableOpacity
            style={styles.cancelRideButton}
            onPress={() => handleCancelRide(detailsDriver.id)}
            activeOpacity={0.85}
          >
            <Text style={styles.cancelRideButtonText}>Cancel Ride</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
