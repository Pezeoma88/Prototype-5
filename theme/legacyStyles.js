import { StyleSheet } from 'react-native';

// Prototype 4 styles, moved here unchanged from App.js in Phase 1A so the
// existing screens look and behave exactly as before while App.js is split
// into screens/components. Phase 1B replaces these with the theme in
// theme/theme.js; new UI should not add styles here.
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#16213E',
  },

  // Dark navy header: brand row + inline stat chips
  header: {
    backgroundColor: '#16213E',
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  logoMark: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoMarkText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#16213E',
  },
  brandTextGroup: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.2,
  },
  brandTagline: {
    fontSize: 12.5,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingVertical: 12,
  },
  statChip: {
    flex: 1,
    alignItems: 'center',
  },
  statChipNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  statChipLabel: {
    fontSize: 11.5,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },

  // Scrollable page area
  scrollArea: {
    flex: 1,
    backgroundColor: '#F3F5F8',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 32,
  },

  // Match Confirmed screen
  confirmationWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
  confirmationCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF1F6',
    shadowColor: '#16213E',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  confirmationIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B6EF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  confirmationIcon: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#16213E',
    marginBottom: 6,
  },
  confirmationSubtitle: {
    fontSize: 13.5,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmationDetailsBox: {
    width: '100%',
    backgroundColor: '#F7F9FC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 20,
  },
  confirmationDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  confirmationDetailLabel: {
    fontSize: 13,
    color: '#8A93A3',
    fontWeight: '600',
  },
  confirmationDetailValue: {
    fontSize: 14,
    color: '#1A2333',
    fontWeight: '700',
  },
  confirmationDetailDivider: {
    height: 1,
    backgroundColor: '#E8EBF0',
  },
  confirmationDoneButton: {
    alignSelf: 'stretch',
    marginBottom: 0,
  },

  // Ride Details screen
  detailsWrap: {
    flex: 1,
    paddingTop: 4,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEF1F6',
    shadowColor: '#16213E',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  detailsBackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  detailsBackArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B6EF5',
    marginRight: 2,
  },
  detailsBackText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B6EF5',
  },
  detailsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  detailsHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  detailsDriverName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#16213E',
  },
  detailsHeaderHint: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#8A93A3',
    marginTop: 2,
  },
  detailsMatchedEmpty: {
    fontSize: 14,
    color: '#8A93A3',
    marginBottom: 18,
  },
  cancelRideButton: {
    backgroundColor: '#FDECEC',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  cancelRideButtonText: {
    color: '#D64545',
    fontSize: 15,
    fontWeight: '700',
  },

  // Section headers (shared by Available Rides / Looking for a Ride / forms)
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionAccent: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  sectionAccentDriver: {
    backgroundColor: '#3B6EF5',
  },
  sectionAccentRider: {
    backgroundColor: '#F2994A',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#16213E',
    letterSpacing: 0.1,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF1F6',
    paddingVertical: 22,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#8A93A3',
  },

  // Available Rides horizontal carousel
  rideCarousel: {
    paddingRight: 4,
    paddingBottom: 4,
    marginBottom: 20,
  },
  rideCard: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#EEF1F6',
    shadowColor: '#16213E',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  rideCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rideCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2333',
  },
  rideCardRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rideCardRouteIcon: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B6EF5',
    marginRight: 5,
  },
  rideCardDestination: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#3A4256',
  },
  rideCardTimeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F5F8',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 8,
    marginBottom: 8,
  },
  rideCardCounts: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A93A3',
    marginBottom: 12,
  },

  // Spike: request notice, pending request rows, accept / deny buttons
  noticeBox: {
    backgroundColor: '#EEF3FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6E2FE',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  noticeText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#16213E',
  },
  pendingList: {
    marginBottom: 18,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F7E3D1',
  },
  pendingInfo: {
    flex: 1,
  },
  pendingStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F2994A',
  },
  pendingReasonText: {
    fontSize: 12.5,
    fontStyle: 'italic',
    color: '#5B6472',
    marginTop: 2,
  },
  acceptButton: {
    backgroundColor: '#3B6EF5',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginLeft: 6,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  denyButton: {
    backgroundColor: '#FDECEC',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginLeft: 6,
  },
  denyButtonText: {
    color: '#D64545',
    fontSize: 13,
    fontWeight: '700',
  },
  rideCardTimeText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#5B6472',
  },
  rideCardButton: {
    backgroundColor: '#3B6EF5',
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: 'center',
  },
  rideCardButtonDisabled: {
    backgroundColor: '#E5E8EE',
  },
  rideCardButtonText: {
    color: '#fff',
    fontSize: 13.5,
    fontWeight: '700',
  },
  rideCardButtonTextDisabled: {
    color: '#9AA3B2',
  },

  // Reservation panel: pick a waiting rider to match with a driver
  reservationPanel: {
    backgroundColor: '#EEF3FF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D6E2FE',
  },
  reservationTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#16213E',
  },
  reservationSubtitle: {
    fontSize: 12.5,
    color: '#5B6B8C',
    marginTop: 3,
    marginBottom: 14,
  },
  riderPickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E4EBFC',
  },
  riderPickAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  riderPickName: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#1A2333',
  },
  riderPickArrow: {
    fontSize: 18,
    color: '#9AA3B2',
  },

  // Driver / rider avatars (shared)
  avatarRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8EFFE',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#3B6EF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  riderAvatar: {
    backgroundColor: '#F2994A',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  seatBadge: {
    backgroundColor: '#E8EFFE',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  seatBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B6EF5',
  },

  // Looking for a Ride: wrapping chip row
  riderChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  riderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#F7E3D1',
  },
  riderChipAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  riderChipName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A2333',
  },

  // Primary actions: side-by-side quick-action cards
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#EEF1F6',
    borderBottomWidth: 3,
    shadowColor: '#16213E',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  actionCardDriver: {
    borderBottomColor: '#3B6EF5',
  },
  actionCardRider: {
    borderBottomColor: '#F2994A',
  },
  actionCardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16213E',
  },
  actionCardHint: {
    fontSize: 12,
    color: '#8A93A3',
    marginTop: 3,
  },

  // Section containers (forms)
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#EEF1F6',
    shadowColor: '#16213E',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  // Form inputs
  input: {
    borderWidth: 1,
    borderColor: '#DADFE6',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#FAFBFC',
  },
  errorText: {
    color: '#D64545',
    fontSize: 14,
    marginBottom: 12,
  },
  reasonInput: {
    minHeight: 64,
    textAlignVertical: 'top',
  },

  saveDriverButton: {
    backgroundColor: '#3B6EF5',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  saveRiderButton: {
    backgroundColor: '#F2994A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#EDEFF2',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '600',
  },

  // Sign-in screen
  authFlexWrap: {
    flex: 1,
  },
  authScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: '#16213E',
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginTop: 14,
  },
  authSubtitle: {
    fontSize: 13.5,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 6,
    textAlign: 'center',
  },
  authCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
  },
  authLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B6472',
    marginBottom: 8,
    marginTop: 4,
  },
  authHint: {
    fontSize: 12,
    color: '#8A93A3',
    marginBottom: 16,
  },
  authReturningNotice: {
    backgroundColor: '#EEF3FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6E2FE',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  authReturningNoticeText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#16213E',
  },
  authDisclaimer: {
    fontSize: 11.5,
    color: '#8A93A3',
    marginTop: 4,
    lineHeight: 16,
  },
  roleToggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  roleToggleButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DADFE6',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FAFBFC',
  },
  roleToggleButtonActiveDriver: {
    backgroundColor: '#3B6EF5',
    borderColor: '#3B6EF5',
  },
  roleToggleButtonActiveRider: {
    backgroundColor: '#F2994A',
    borderColor: '#F2994A',
  },
  roleToggleText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#5B6472',
  },
  roleToggleTextActive: {
    color: '#fff',
  },

  // Signed-in account row (header)
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  accountText: {
    flex: 1,
    fontSize: 12.5,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  accountTextStrong: {
    color: '#fff',
    fontWeight: '700',
  },
  roleBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 10,
  },
  roleBadgeDriver: {
    backgroundColor: 'rgba(59, 110, 245, 0.35)',
  },
  roleBadgeRider: {
    backgroundColor: 'rgba(242, 153, 74, 0.35)',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  // Solid-color variant for use on light (white card) backgrounds, like the
  // Profile screen, where the header's semi-transparent tint reads too pale.
  roleBadgeInlineDriver: {
    backgroundColor: '#3B6EF5',
    marginRight: 0,
  },
  roleBadgeInlineRider: {
    backgroundColor: '#F2994A',
    marginRight: 0,
  },
  accountActionButton: {
    marginLeft: 10,
  },
  profileLinkText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#fff',
  },
  logOutText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#fff',
  },

  // Wraps the scrollable page area so the keyboard can push content (and the
  // Save/Post Ride button) up instead of covering it.
  mainFlexWrap: {
    flex: 1,
  },

  // Full-ride indicators
  seatBadgeFull: {
    backgroundColor: '#FDECEC',
  },
  seatBadgeTextFull: {
    color: '#D64545',
  },
  fullPill: {
    backgroundColor: '#FDECEC',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  fullPillText: {
    color: '#D64545',
    fontSize: 13,
    fontWeight: '700',
  },
  yourRideTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B6EF5',
    marginBottom: 2,
  },

  // Self-service "Leave" / "Remove" buttons on a rider's own chip
  riderChipLeaveButton: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#FDECEC',
  },
  riderChipLeaveText: {
    color: '#D64545',
    fontSize: 11.5,
    fontWeight: '700',
  },

  // "Posting as ..." / "You'll be listed as ..." note at the top of a form
  formHint: {
    fontSize: 13.5,
    color: '#5B6472',
    lineHeight: 19,
    marginBottom: 14,
  },
  formHintStrong: {
    fontWeight: '700',
    color: '#16213E',
  },

  // Small Available Rides sort control
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: -2,
    marginBottom: 12,
  },
  sortLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#8A93A3',
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#DADFE6',
    backgroundColor: '#fff',
  },
  sortOptionActive: {
    backgroundColor: '#3B6EF5',
    borderColor: '#3B6EF5',
  },
  sortOptionText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#5B6472',
  },
  sortOptionTextActive: {
    color: '#fff',
  },

  // "Loading rides…" text under the spinner in the empty card
  loadingMessage: {
    marginTop: 8,
  },

  // Owner's Edit Ride button on Ride Details (sits above Cancel Ride)
  editRideButton: {
    backgroundColor: '#EEF3FF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  editRideButtonText: {
    color: '#3B6EF5',
    fontSize: 15,
    fontWeight: '700',
  },

  // Departure date/time wheels in the Post Ride form
  departureDisplay: {
    justifyContent: 'center',
  },
  departureDisplayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2333',
  },
  departureDisplayPlaceholder: {
    fontSize: 16,
    color: '#9AA3B2',
  },
  departureButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  departureButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DADFE6',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FAFBFC',
  },
  departureButtonActive: {
    backgroundColor: '#3B6EF5',
    borderColor: '#3B6EF5',
  },
  departureButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B6EF5',
  },
  departureButtonTextActive: {
    color: '#fff',
  },
  departurePickerBox: {
    backgroundColor: '#FAFBFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DADFE6',
    marginBottom: 12,
    overflow: 'hidden',
  },
});

export default styles;
