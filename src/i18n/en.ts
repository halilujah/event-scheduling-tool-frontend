export const en = {
  // Navigation
  nav: {
    title: "Event Scheduler"
  },

  // Create Event Page
  createEvent: {
    title: "Create New Event",
    organizerName: "Your Name",
    organizerNamePlaceholder: "Enter your name",
    eventTitle: "Event Title",
    eventTitlePlaceholder: "e.g., Team Meeting",
    selectType: "Select Type",
    typeSpecific: "Specific Dates",
    typeDaysOfWeek: "Days of Week",
    selectDates: "Select Dates",
    selectDays: "Select Days",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    timeRange: "Time Range",
    startTime: "Start Time",
    endTime: "End Time",
    timezone: "Timezone",
    createButton: "Create Event",
    validationOrganizerName: "Please enter your name",
    validationEventTitle: "Please enter an event title",
    validationDates: "Please select at least one date",
    validationDays: "Please select at least one day",
    validationTimeRange: "End time must be after start time"
  },

  // Event Created Page
  eventCreated: {
    title: "Event Created Successfully!",
    shareLink: "Share this link with participants:",
    copyButton: "Copy Link",
    copiedButton: "Copied!",
    participants: "Participants",
    noParticipants: "No participants yet.",
    availability: "Availability Overview",
    viewPersonal: "View Personal",
    viewAggregate: "View Aggregate",
    finalizeEvent: "Finalize Event",
    finalizedBanner: "Event Finalized",
    finalizedMessage: "This event has been finalized for:",
    downloadICS: "Download Calendar Event (.ics)",
    organizer: "(Organizer)"
  },

  // Event Voting Page
  eventVoting: {
    eventId: "Event ID:",
    finalizedBanner: "Event Finalized",
    finalizedMessage: "This event has been finalized for:",
    downloadICS: "Download Calendar Event (.ics)",
    joinEvent: "Join Event",
    yourName: "Your Name",
    yourNamePlaceholder: "Enter your name",
    joinButton: "Join",
    validationName: "Please enter your name",
    participants: "Participants",
    noParticipants: "No participants yet.",
    yourAvailability: "Your Availability",
    selectSlots: "Click on time slots to mark your availability",
    viewPersonal: "View Personal",
    viewAggregate: "View Aggregate",
    availability: "Availability Overview",
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
