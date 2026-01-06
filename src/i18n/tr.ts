import { type TranslationKeys } from './en';

export const tr: TranslationKeys = {
  // Navigation
  nav: {
    title: "Etkinlik Planlayıcı"
  },

  // Create Event Page
  createEvent: {
    title: "Yeni Etkinlik Oluştur",
    organizerName: "Adınız",
    organizerNamePlaceholder: "Adınızı girin",
    organizerSubtitle: "Bu etkinliği organizatör olarak oluşturuyorsunuz",
    eventTitle: "Etkinlik Başlığı",
    eventTitlePlaceholder: "örn., Takım Toplantısı",
    eventTitleSubtitle: "Veya otomatik oluşturması için boş bırakın",
    selectType: "Tür Seçin",
    typeSpecific: "Belirli Tarihler",
    typeDaysOfWeek: "Haftanın Günleri",
    selectDates: "Tarih Seçin",
    selectDatesSubtitle: "Seçmek için tıklayın",
    selectDays: "Gün Seçin",
    monday: "Pazartesi",
    tuesday: "Salı",
    wednesday: "Çarşamba",
    thursday: "Perşembe",
    friday: "Cuma",
    saturday: "Cumartesi",
    sunday: "Pazar",
    timeRange: "Zaman Aralığı",
    timeRangeSubtitle: "Bir zaman aralığı seçin",
    startTime: "Başlangıç Saati",
    endTime: "Bitiş Saati",
    timezone: "Saat Dilimi",
    createButton: "Etkinlik Oluştur",
    validationOrganizerName: "Lütfen adınızı girin",
    validationEventTitle: "Lütfen bir etkinlik başlığı girin",
    validationDates: "Lütfen en az bir tarih seçin",
    validationDays: "Lütfen en az bir gün seçin",
    validationTimeRange: "Bitiş saati başlangıç saatinden sonra olmalıdır",
    validationPastDates: "Geçmiş tarihler seçilemez",
    validationPastTime: "Bugün için seçilen başlangıç saati geçmiş bir zamanda",
    validationNoSelection: "Lütfen en az bir tarih veya gün seçin",
    pastDateTooltip: "Geçmiş tarihler seçilemez",
    recentlyVisited: "Son ziyaret edilenler",
    createdAgo: "{time} önce oluşturuldu",
    votingDeadline: "Oylama Son Tarihi",
    setDeadline: "Son tarih belirle",
    deadlineSubtitle: "Bu süreden sonra oylama kilitlenecek",
    deadlineDate: "Tarih",
    deadlineTime: "Saat",
    validationDeadlineDate: "Lütfen bir son tarih seçin",
    validationDeadlinePast: "Son tarih gelecekte olmalı"
  },

  // Event Created Page
  eventCreated: {
    title: "Etkinlik Oluşturuldu!",
    subtitle: "{title}. Bu QR kodunu veya bağlantıyı katılımcılarınızla paylaşın.",
    subtitleNoTitle: "Etkinliğiniz hazır. Bu QR kodunu veya bağlantıyı katılımcılarınızla paylaşın.",
    organizedBy: "👑 Organizatör: {name}",
    shareLink: "Bağlantıyı Paylaş",
    createAnother: "Başka Etkinlik Oluştur",
    groupAvailability: "Grup Uygunluğu",
    organizerHint: "👑 Organizatör - Sonlandırmak için bir zaman dilimine tıklayın",
    finalizedLabel: "✓ Sonlandırıldı: {time}",
    finalizedTitle: "Etkinlik Sonlandırıldı!",
    scheduledFor: "Planlandığı zaman:",
    votingClosed: "Katılımcılar artık oy veremez",
    downloadICS: "Takvim Etkinliğini İndir (.ics)",
    clickToFinalize: "💡 Etkinliği sonlandırmak için bir zaman dilimine tıklayın",
    liveUpdates: "🟢 Canlı güncellemeler etkin - değişiklikler anında görünür",
    participants: "Katılımcılar",
    noParticipants: "Henüz katılımcı yok.",
    organizer: "(Organizatör)"
  },

  // Event Voting Page
  eventVoting: {
    eventId: "Etkinlik ID:",
    finalizedBanner: "Etkinlik Sonlandırıldı! Planlandığı zaman:",
    votingClosed: "Oylama artık kapalı",
    downloadICS: "Takvim Etkinliğini İndir (.ics)",
    joinEvent: "Etkinliğe Katıl",
    yourName: "Adınız",
    yourNamePlaceholder: "Adınız",
    joinButton: "Katıl",
    selectSlots: "Lütfen uygun olduğunuz tüm zamanları seçin.",
    availability: "Uygunluk",
    myVote: "Oyum",
    groupView: "Grup Görünümü",
    groupViewFinalize: "Grup Görünümü (Sonlandırmak için Tıklayın)",
    autoSaved: "✓ Değişiklikleriniz otomatik olarak kaydedildi",
    clickToFinalize: "💡 Etkinliği sonlandırmak için bir zaman dilimine tıklayın",
    votingLocked: "🔒 Oylama kilitli - Etkinlik sonlandırıldı",
    yourStatus: "Durumunuz",
    participatingAs: "Katılımcı olarak:",
    identitySaved: "✓ Kimliğiniz bu etkinlik için kaydedildi",
    participants: "Katılımcılar",
    noParticipants: "Henüz katılımcı yok.",
    loading: "Etkinlik yükleniyor...",
    organizer: "(Organizatör)",
    votingDeadlineExpired: "Oylama süresi doldu. Artık oy veremezsiniz.",
    votingDeadlineLocked: "Oylama kilitlendi - son tarih geçti",
    waitingForOrganizer: "Organizatörün etkinliği sonlandırması bekleniyor"
  },

  // Participant Modal
  participantModal: {
    title: "Uygunluk",
    loading: "Yükleniyor...",
    close: "Kapat"
  },

  // Participant List
  participantList: {
    viewAvailability: "Uygunluğu Görüntüle",
    blockUser: "Kullanıcıyı Engelle",
    blockConfirm: "{name} kullanıcısını engellemek istediğinizden emin misiniz? Bu etkinlikten kaldırılacak ve tekrar katılamayacak."
  },

  // Heatmap
  heatmap: {
    votes: "oy",
    finalized: "Sonlandırıldı",
    finalizeButton: "Sonlandır",
    finalizeConfirm: "Bu etkinliği {timeSlot} için sonlandırmak istiyor musunuz? Katılımcılar artık oy veremeyecek."
  },

  // Common
  common: {
    loading: "Yükleniyor...",
    error: "Bir hata oluştu",
    success: "Başarılı",
    cancel: "İptal",
    confirm: "Onayla",
    save: "Kaydet",
    delete: "Sil",
    edit: "Düzenle"
  },

  // Date and Time
  dateTime: {
    months: {
      january: "Ocak",
      february: "Şubat",
      march: "Mart",
      april: "Nisan",
      may: "Mayıs",
      june: "Haziran",
      july: "Temmuz",
      august: "Ağustos",
      september: "Eylül",
      october: "Ekim",
      november: "Kasım",
      december: "Aralık"
    },
    daysShort: {
      sun: "Paz",
      mon: "Pzt",
      tue: "Sal",
      wed: "Çar",
      thu: "Per",
      fri: "Cum",
      sat: "Cmt"
    },
    am: "ÖÖ",
    pm: "ÖS",
    start: "BAŞLANGIÇ",
    end: "BİTİŞ"
  },

  // Error Messages
  errors: {
    failedToLoad: "Etkinlik verileri yüklenemedi",
    failedToJoin: "Etkinliğe katılım başarısız. Lütfen tekrar deneyin.",
    blocked: "Organizatör tarafından bu etkinlikten engellendiniz.",
    failedToVote: "Oylar kaydedilemedi. Lütfen tekrar deneyin.",
    failedToFinalize: "Etkinlik sonlandırılamadı. Lütfen tekrar deneyin.",
    failedToBlock: "Kullanıcı engellenemedi. Lütfen tekrar deneyin."
  }
};
