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
    eventTitle: "Etkinlik Başlığı",
    eventTitlePlaceholder: "örn., Takım Toplantısı",
    selectType: "Tür Seçin",
    typeSpecific: "Belirli Tarihler",
    typeDaysOfWeek: "Haftanın Günleri",
    selectDates: "Tarih Seçin",
    selectDays: "Gün Seçin",
    monday: "Pazartesi",
    tuesday: "Salı",
    wednesday: "Çarşamba",
    thursday: "Perşembe",
    friday: "Cuma",
    saturday: "Cumartesi",
    sunday: "Pazar",
    timeRange: "Zaman Aralığı",
    startTime: "Başlangıç Saati",
    endTime: "Bitiş Saati",
    timezone: "Saat Dilimi",
    createButton: "Etkinlik Oluştur",
    validationOrganizerName: "Lütfen adınızı girin",
    validationEventTitle: "Lütfen bir etkinlik başlığı girin",
    validationDates: "Lütfen en az bir tarih seçin",
    validationDays: "Lütfen en az bir gün seçin",
    validationTimeRange: "Bitiş saati başlangıç saatinden sonra olmalıdır"
  },

  // Event Created Page
  eventCreated: {
    title: "Etkinlik Başarıyla Oluşturuldu!",
    shareLink: "Bu bağlantıyı katılımcılarla paylaşın:",
    copyButton: "Bağlantıyı Kopyala",
    copiedButton: "Kopyalandı!",
    participants: "Katılımcılar",
    noParticipants: "Henüz katılımcı yok.",
    availability: "Uygunluk Özeti",
    viewPersonal: "Kişisel Görünüm",
    viewAggregate: "Toplu Görünüm",
    finalizeEvent: "Etkinliği Sonlandır",
    finalizedBanner: "Etkinlik Sonlandırıldı",
    finalizedMessage: "Bu etkinlik şu zaman için sonlandırıldı:",
    downloadICS: "Takvim Etkinliğini İndir (.ics)",
    organizer: "(Organizatör)"
  },

  // Event Voting Page
  eventVoting: {
    eventId: "Etkinlik ID:",
    finalizedBanner: "Etkinlik Sonlandırıldı",
    finalizedMessage: "Bu etkinlik şu zaman için sonlandırıldı:",
    downloadICS: "Takvim Etkinliğini İndir (.ics)",
    joinEvent: "Etkinliğe Katıl",
    yourName: "Adınız",
    yourNamePlaceholder: "Adınızı girin",
    joinButton: "Katıl",
    validationName: "Lütfen adınızı girin",
    participants: "Katılımcılar",
    noParticipants: "Henüz katılımcı yok.",
    yourAvailability: "Uygunluğunuz",
    selectSlots: "Uygunluğunuzu işaretlemek için zaman dilimlerine tıklayın",
    viewPersonal: "Kişisel Görünüm",
    viewAggregate: "Toplu Görünüm",
    availability: "Uygunluk Özeti",
    loading: "Etkinlik yükleniyor...",
    organizer: "(Organizatör)"
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
