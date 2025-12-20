export const en = {
  // Navigation
  nav: {
    title: "Event Scheduler"
  },

  // Create Event Page
  createEvent: {
    title: "Create New Event",
    organizerName: "Your Name (test)",
    organizerNamePlaceholder: "Enter your name",
    organizerSubtitle: "You're creating this event as the organizer",
    eventTitle: "Event Title",
    eventTitlePlaceholder: "e.g., Team Meeting",
    eventTitleSubtitle: "Or leave blank to generate one",
    selectType: "Select Type",
    typeSpecific: "Specific Dates",
    typeDaysOfWeek: "Days of Week",
    selectDates: "Select Dates",
    selectDatesSubtitle: "Click to select",
    selectDays: "Select Days",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    timeRange: "Time Range",
    timeRangeSubtitle: "Select a time range",
    startTime: "Start Time",
    endTime: "End Time",
    timezone: "Timezone",
    createButton: "Create Event",
    validationOrganizerName: "Please enter your name",
    validationEventTitle: "Please enter an event title",
    validationDates: "Please select at least one date",
    validationDays: "Please select at least one day",
    validationTimeRange: "End time must be after start time",
    recentlyVisited: "Recently visited",
    createdAgo: "Created {time} ago"
  },

  // Event Created Page
  eventCreated: {
    title: "Event Created!",
    subtitle: "{title}. Share this QR code or link with your participants.",
    subtitleNoTitle: "Your event is ready. Share this QR code or link with your participants.",
    organizedBy: "👑 Organized by: {name}",
    shareLink: "Share Link",
    createAnother: "Create Another Event",
    groupAvailability: "Group Availability",
    organizerHint: "👑 Organizer - Click a time slot to finalize",
    finalizedLabel: "✓ Finalized: {time}",
    finalizedTitle: "Event Finalized!",
    scheduledFor: "Scheduled for:",
    votingClosed: "Participants can no longer vote",
    downloadICS: "Download Calendar Event (.ics)",
    clickToFinalize: "💡 Click on a time slot to finalize the event",
    liveUpdates: "🟢 Live updates enabled - changes appear instantly",
    participants: "Participants",
    noParticipants: "No participants yet.",
    organizer: "(Organizer)"
  },

  // Event Voting Page
  eventVoting: {
    eventId: "Event ID:",
    finalizedBanner: "Event Finalized! Scheduled for:",
    votingClosed: "Voting is now closed",
    downloadICS: "Download Calendar Event (.ics)",
    joinEvent: "Join Event",
    yourName: "Your Name",
    yourNamePlaceholder: "Your Name",
    joinButton: "Join",
    selectSlots: "Please select all times you are available.",
    availability: "Availability",
    myVote: "My Vote",
    groupView: "Group View",
    groupViewFinalize: "Group View (Click to Finalize)",
    autoSaved: "✓ Your changes are saved automatically",
    clickToFinalize: "💡 Click on a time slot to finalize the event",
    votingLocked: "🔒 Voting is locked - Event has been finalized",
    yourStatus: "Your Status",
    participatingAs: "You're participating as:",
    identitySaved: "✓ Your identity is saved for this event",
    participants: "Participants",
    noParticipants: "No participants yet.",
    loading: "Loading event...",
    organizer: "(Organizer)"
  },

  // Participant Modal
  participantModal: {
    title: "Availability",
    loading: "Loading...",
    close: "Close"
  },

  // Participant List
  participantList: {
    viewAvailability: "View Availability",
    blockUser: "Block User",
    blockConfirm: "Are you sure you want to block {name}? They will be removed from this event and cannot rejoin."
  },

  // Heatmap
  heatmap: {
    votes: "votes",
    finalized: "Finalized",
    finalizeButton: "Finalize",
    finalizeConfirm: "Finalize this event for {timeSlot}? Participants will no longer be able to vote."
  },

  // Common
  common: {
    loading: "Loading...",
    error: "An error occurred",
    success: "Success",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    delete: "Delete",
    edit: "Edit"
  },

  // Date and Time
  dateTime: {
    months: {
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December"
    },
    daysShort: {
      sun: "Sun",
      mon: "Mon",
      tue: "Tue",
      wed: "Wed",
      thu: "Thu",
      fri: "Fri",
      sat: "Sat"
    },
    am: "am",
    pm: "pm",
    start: "START",
    end: "END"
  },

  // Error Messages
  errors: {
    failedToLoad: "Failed to load event data",
    failedToJoin: "Failed to join event. Please try again.",
    blocked: "You have been blocked from this event by the organizer.",
    failedToVote: "Failed to save votes. Please try again.",
    failedToFinalize: "Failed to finalize event. Please try again.",
    failedToBlock: "Failed to block user. Please try again."
  }
};

export type TranslationKeys = typeof en;
