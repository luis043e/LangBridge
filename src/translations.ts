export const supportedLanguageCodes = [
  'en',
  'es',
  'fr',
  'pt',
  'de',
  'it',
  'ja',
  'ko',
  'zh',
  'ar',
  'ru',
  'tr',
  'nl',
  'pl',
  'hi',
] as const;

export type SupportedLanguageCode =
  (typeof supportedLanguageCodes)[number];

export const activeLanguageCodes = [
  'en',
  'es',
] as const;

export type AppLanguage =
  (typeof activeLanguageCodes)[number];

  export const isSupportedLanguageCode = (
  value: unknown
): value is SupportedLanguageCode => {
  return (
    typeof value === 'string' &&
    supportedLanguageCodes.some(
      (languageCode) => languageCode === value
    )
  );
};

export const isAppLanguage = (
  value: unknown
): value is AppLanguage => {
  return (
    typeof value === 'string' &&
    activeLanguageCodes.some(
      (languageCode) => languageCode === value
    )
  );
};
export const translations = {
  en: {
    chooseLanguage: {
      title: 'Choose your language',
      subtitle: 'Select the language you want to use in LangBridge.',
      english: 'English',
      englishDescription: 'Use LangBridge in English',
      spanish: 'Spanish',
      spanishDescription: 'Use LangBridge in Spanish',
      note: 'You can change the interface language later in Settings.',
      continue: 'Continue',
      changeInterfaceLanguage:
  'Change interface language',
comingSoon: 'SOON',
saveErrorTitle:
  'Language could not be saved',
saveErrorMessage:
  'Check your connection and try again.',
loadingLanguage:
  'Loading your language...',
interfaceLanguage:
  'Interface language',
continuing:
  'Continuing...',
changeLater:
  'You can change this language later.',
    },
    settingsScreen: {
  defaultUserName: 'LangBridge user',
  emailUnavailable: 'Email unavailable',
  signOutTitle: 'Sign out',
  signOutConfirmation:
    'Are you sure you want to sign out?',
  cancel: 'Cancel',
  signOut: 'Sign out',
  signOutErrorTitle: 'Sign out failed',
  tryAgain: 'Please try again.',
  back: '‹ Back',
  title: 'Profile and settings',
  subtitle:
    'Manage your account and preferences.',
  accountSection: 'Account',
  editProfile: 'Edit profile',
  editProfileDescription:
    'Name, location, and personal information.',
  viewPublicProfile:
    'View my public profile',
  viewPublicProfileDescription:
    'Preview how other people see your profile.',
  changeInterfaceLanguage:
    'Change interface language',
  interfaceLanguage:
    'Interface language',
  interfaceLanguageDescription:
    'Change the language of LangBridge text and menus.',
  languagesAndLevel:
    'Languages and level',
  languagesAndLevelDescription:
    'Update your language profile.',
  privacyAndSecurity:
    'Privacy and security',
  privacyAndSecurityDescription:
    'Blocks, reports, and account controls.',
},
tabs: {
  home: 'Home',
  explore: 'Explore',
  conversations: 'Chats',
  settings: 'Profile',
},
lessonScreen: {
  exerciseProgress: 'EXERCISE 1 OF 3',
  title: 'Choose the correct translation',
  question:
    'How do you say “Hola” in English?',
  answerChecked: 'Answer checked',
  check: 'Check',
},
learnScreen: {
  back: '‹ Back',
  title: 'Learn',
  subtitle:
    'Advance with short lessons and daily practice.',
  streak: 'Streak',
  points: 'Points',
  lives: 'Lives',
  dailyGoal: 'Daily goal',
  dailyGoalDescription:
    'Complete one lesson today',
  unitOneTitle:
    'Unit 1: First steps',
  unitOneDescription:
    'Learn greetings and essential expressions.',
  lessonOneAvailable:
    'Lesson 1 available',
},
googleAuth: {
  missingWebClientId:
    'The Google Web Client ID is not configured.',
  invalidIdToken:
    'Google did not return a valid token.',
},
    welcome: {
      slogan: 'Practice. Connect. Grow.',
      description:
        'Connect with native speakers, exchange languages and grow together.',
      getStarted: 'Get Started',
      login: 'I already have an account',
      footer: 'Build real connections through language',
    },

    homeScreen: {
  welcome: 'Welcome to LangBridge',
  subtitle: 'Your language journey starts here.',
  weeklyGoal: 'YOUR WEEKLY GOAL',
  startPracticing: 'Start practicing today',
  profileDescription: 'Complete your language profile to find compatible learning partners.',
  profileProgress: 'Profile progress',
  quickActions: 'Quick actions',
  completeProfile: 'Complete your profile',
  completeProfileDescription: 'Add your native language, learning language and interests.',
  findPartners: 'Find language partners',
  findPartnersDescription: 'Discover people who want to exchange languages with you.',
  conversations: 'Your conversations',
conversationsDescription: 'Continue practicing with your language partners.',
learn: 'Learn',
newBadge: 'NEW',
learnDescription:
  'Lessons, levels, points, and daily practice.',
requests: 'Requests',
requestsDescription:
  'Review and respond to your connection requests.',
connections: 'My connections',
connectionsDescription:
  'View the people you can already practice with.',
profileAndSettings: 'Profile and settings',
profileAndSettingsDescription:
  'Manage your account, preferences, and session.',
tipLabel: 'LANGBRIDGE TIP',
tipText: 'A complete profile helps you find more reliable and compatible language partners.',
},
exploreScreen: {
  unspecified: 'Not specified',
  levelNotSpecified: 'Level not specified',
  defaultUserName: 'LangBridge user',
  locationNotSpecified: 'Location not specified',
  countryNotSpecified: 'Country not specified',
  loadError:
    'Language partners could not be loaded.',
  back: '‹ Back',
  title: 'Find language partners',
  subtitle:
    'Connect with people who can help you practice the language you are learning.',
  searchPlaceholder:
    'Search by name, country, or language',
  partnerFound: 'partner found',
  partnersFound: 'partners found',
  allFilter: 'All',
  matchesFilter: '✨ Matches',
  onlineFilter: '● Online',
  findingPartners: 'Finding partners...',
  profilesCouldNotBeLoaded:
    'Profiles could not be loaded',
  noIdealMatchesFound:
    'No ideal matches found yet',
  noResultsFound: 'No results found',
  noOtherPartners: 'No other partners yet',
  noIdealMatchesOnline:
    'There are no ideal matches online right now. You can view every match or all partners.',
  idealMatchesDescription:
    'When someone has a reciprocal language match with you, that person will appear here.',
  tryAnotherSearch:
    'Try another name, country, or language.',
  viewAllPartners: 'View all partners',
  idealMatchBadge: '✨ Ideal match',
speaks: 'Speaks',
learns: 'Learns',
},
conversationsScreen: {
  loginRequired:
    'You must log in again.',
  defaultPartnerName:
    'LangBridge partner',
  timeLocale: 'en-US',
  noMessagesYet:
    'No messages yet.',
  loadError:
    'Conversations could not be loaded.',
  back: '‹ Back',
  title: 'Conversations',
  subtitle:
    'Keep practicing with your connections.',
  loading:
    'Loading conversations...',
  loadErrorTitle:
    'Conversations could not be loaded',
  emptyTitle:
    'No conversations yet',
  emptyDescription:
    'Open a connection and send a message to get started.',
},
chatScreen: {
  defaultPartnerName:
    'LangBridge partner',
  preparationError:
    'This conversation could not be prepared.',
  openError:
    'The conversation could not be opened. Try again.',
  timeLocale: 'en-US',
  messagesLoadError:
    'Messages could not be loaded.',
  identificationError:
    'This conversation could not be identified.',
  sendError:
    'The message could not be sent. Check your connection and try again.',
  connectionStatus:
    'Language connection',
  emptyTitle:
    'Start the conversation',
  emptyDescription:
    'Send a message to {partnerName} to start practicing.',
  seen: 'Seen',
  sent: 'Sent',
  messagePlaceholder:
    'Write a message...',
},
connectionsScreen: {
  loginRequired:
    'You must log in again.',
  defaultUserName:
    'LangBridge user',
  loadError:
    'Your connections could not be loaded.',
  back: '‹ Back',
  title: 'My connections',
  subtitle:
    'People you can practice languages with.',
  loading:
    'Loading connections...',
  emptyTitle:
    'No connections yet',
  emptyDescription:
    'Accepted requests will appear here.',
  acceptedConnection:
    'Accepted connection',
},
requestsScreen: {
  loginRequired:
    'You must log in again.',
  defaultUserName:
    'LangBridge user',
  loadError:
    'Requests could not be loaded.',
  acceptedTitle:
    'Request accepted',
  rejectedTitle:
    'Request rejected',
  acceptedMessage:
    'This person is now one of your connections.',
  rejectedMessage:
    'The request was rejected successfully.',
  responseErrorTitle:
    'Response failed',
  responseErrorMessage:
    'The request could not be updated. Check your connection and try again.',
  back: '‹ Back',
  title:
    'Received requests',
  subtitle:
    'People who want to connect with you to practice languages.',
  loading:
    'Loading requests...',
  loadErrorTitle:
    'Requests could not be loaded',
  emptyTitle:
    'No pending requests',
  emptyDescription:
    'New requests will appear here.',
  wantsToConnect:
    'Wants to connect with you.',
  pending: 'PENDING',
  processing:
    'Processing...',
  accept: 'Accept',
  reject: 'Reject',
},
blockedUsersScreen: {
  defaultUserName:
    'LangBridge user',
  loadErrorTitle:
    'Could not load',
  connectionError:
    'Check your connection and try again.',
  unblockTitle:
    'Unblock user',
  unblockConfirmation:
    'Do you want to unblock {userName}?',
  cancel: 'Cancel',
  unblock: 'Unblock',
  unblockSuccessTitle:
    'User unblocked',
  unblockSuccessMessage:
    '{userName} was unblocked.',
  unblockErrorTitle:
    'Could not unblock',
  back: '‹ Back',
  title:
    'Blocked users',
  subtitle:
    'Manage the accounts you blocked on LangBridge.',
  loading:
    'Loading blocked users...',
  emptyTitle:
    'You have no blocked users',
  emptyDescription:
    'Accounts you block will appear here.',
},
reportProblemScreen: {
  sessionUnavailableTitle:
    'Session unavailable',
  sessionUnavailableMessage:
    'Please log in again to submit the report.',
  selectCategoryTitle:
    'Select a category',
  selectCategoryMessage:
    'Choose the type of problem you want to report.',
  addMoreInformationTitle:
    'Add more information',
  addMoreInformationMessage:
    'The description must contain at least 10 characters.',
  reportSubmittedTitle:
    'Report submitted',
  reportSubmittedMessage:
    'Thank you. We will review the information you submitted.',
  submitErrorTitle:
    'Could not submit',
  connectionError:
    'Check your connection and try again.',
  back: '‹ Back',
  title: 'Report a problem',
  subtitle:
    'Tell us what happened so we can help.',
  problemType:
    'Problem type',
  describeProblem:
    'Describe the problem',
  descriptionPlaceholder:
    'Explain what happened in as much detail as possible...',
  privateReportNotice:
  'Your report will be submitted privately for review.',
submitting: 'Submitting...',
submitReport: 'Submit report',
categories: {
  technical: 'Technical problem',
  account: 'Account problem',
  user: 'Report behavior',
  privacy: 'Privacy or security',
  other: 'Other problem',
},
},

deleteAccountScreen: {
  requiredConfirmation: 'DELETE',
  sessionUnavailableTitle:
    'Session unavailable',
  sessionUnavailableMessage:
    'Please log in again to continue.',
  incorrectConfirmationTitle:
    'Incorrect confirmation',
  incorrectConfirmationMessage:
    'Type DELETE to confirm the request.',
  confirmRequestTitle:
    'Confirm request',
  confirmRequestMessage:
    'Your profile will be hidden and an account deletion request will be created.',
  cancel: 'Cancel',
  continue: 'Continue',
  requestSubmittedTitle:
    'Request submitted',
  requestSubmittedMessage:
    'Your profile was hidden and the request was submitted.',
  submitErrorTitle:
    'Could not submit',
  connectionError:
    'Check your connection and try again.',
  back: '‹ Back',
  title: 'Delete account',
  subtitle:
    'Request the permanent deletion of your LangBridge account.',
  warningTitle:
    'Before continuing',
  warningText:
    'This request will immediately hide your profile while the deletion is processed.',
  consequencesTitle:
    'Deletion may affect:',
  profileConsequence:
    '• Your profile and preferences.',
  connectionsConsequence:
    '• Your requests and connections.',
  conversationsConsequence:
    '• Your conversations and messages.',
  accessConsequence:
    '• Your future access to LangBridge.',
  confirmationLabel:
    'To confirm, type DELETE',
  helperText:
    'The word must be typed exactly as shown above.',
  processing:
    'Processing request...',
  requestDeletion:
    'Request deletion',
  cancelAndKeepAccount:
    'Cancel and keep my account',
  securityNote:
    'For security, permanent deletion will require additional identity verification.',
},
privacySecurityScreen: {
  emailUnavailableTitle:
    'Email unavailable',
  emailUnavailableMessage:
    'No email address was found for this account.',
  changePasswordTitle:
    'Change password',
  changePasswordMessage:
    'We will send a password change link to {email}.',
  cancel:
    'Cancel',
  sendEmail:
    'Send email',
  emailSentTitle:
    'Email sent',
  emailSentMessage:
    'Check your inbox and spam folder.',
  sendErrorTitle:
    'Could not send',
  connectionError:
    'Check your connection and try again.',
  comingSoonTitle:
    'Feature in development',
  comingSoonMessage:
    'This option will be available soon.',
  sessionUnavailableTitle:
    'Session unavailable',
  sessionUnavailableMessage:
    'Please log in again to change this option.',
  visibilityUpdatedTitle:
    'Visibility updated',
  profileVisibleMessage:
    'Other people will be able to find your profile.',
  profileHiddenMessage:
    'Your profile will no longer appear in searches.',
  saveErrorTitle:
    'Could not save',
  back:
    '‹ Back',
  title:
    'Privacy and security',
  subtitle:
    'Manage your account security and privacy.',
  accountSecurityTitle:
    'Account security',
  changePassword:
    'Change password',
  changePasswordDescription:
    'Update your account password.',
  blockedUsers:
    'Blocked users',
  blockedUsersDescription:
    'Manage the accounts you blocked.',
  profilePrivacyTitle:
    'Profile privacy',
  visibleProfile:
    'Visible profile',
  visibleProfileDescription:
    'Allow other people to find your profile.',
  helpAndControlTitle:
    'Help and control',
  reportProblem:
    'Report a problem',
  reportProblemDescription:
    'Report inappropriate behavior or application issues.',
  deleteAccount:
    'Delete account',
  deleteAccountDescription:
    'Permanently delete your account and data.',
},
editProfileScreen: {
  photoUnavailableTitle:
    'Photo unavailable',
  photoUnavailableMessage:
    'This account does not have a Google photo available.',
  removePhotoTitle:
    'Remove photo',
  removePhotoMessage:
    'Your name initials will be displayed.',
  cancel:
    'Cancel',
  remove:
    'Remove',
  loginRequiredTitle:
    'Login required',
  loginRequiredMessage:
    'You must log in again to update your profile.',
  nameRequiredTitle:
    'Name required',
  nameRequiredMessage:
    'Enter your full name to continue.',
  countryRequiredTitle:
    'Country required',
  countryRequiredMessage:
    'Select your country to continue.',
  profileUpdatedTitle:
    'Profile updated',
  profileUpdatedMessage:
    'Your changes were saved successfully.',
  saveFailedTitle:
    'Save failed',
  connectionError:
    'Check your connection and try again.',
  back:
    '‹ Back',
  title:
    'Edit profile',
  subtitle:
    'Update the information your partners will see.',
  profilePhoto:
    'Profile photo',
  changePhoto:
    'Change photo',
  changePhotoMessage:
    'We will connect the phone gallery in the next step.',
  useGooglePhoto:
    'Use Google photo',
  removePhoto:
    'Remove photo',
  fullName:
    'Full name',
  fullNamePlaceholder:
    'Enter your name',
  country:
    'Country',
  selectCountry:
    'Select your country',
  countryPrivacyHelper:
    'Only your country will be shown publicly.',
  searchCountry:
    'Search country...',
  noCountryResults:
    'We could not find that country.',
  aboutMe:
    'About me',
  bioPlaceholder:
    'Tell others what you want to practice.',
  saving:
    'Saving...',
  saveChanges:
    'Save changes',
},
    loginScreen: {
  title: 'Welcome back',
  subtitle:
    'Log in to continue practicing and connecting through languages.',
  emailLabel: 'Email address',
  emailPlaceholder: 'Enter your email',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Enter your password',
  forgotPassword: 'Forgot password?',
  loginButton: 'Log In',
  noAccount: "Don't have an account?",
  createOne: 'Create one',
  back: '‹ Back',
or: 'or',
continueWithGoogle: 'Continue with Google',
googleErrorTitle:
  'Could not continue with Google',
tryAgain: 'Please try again.',
incompleteFieldsTitle: 'Incomplete fields',
incompleteFieldsMessage:
  'Enter your email address and password.',
invalidEmailTitle: 'Invalid email',
invalidEmailMessage:
  'Enter a valid email address.',
loginErrorTitle: 'Login error',
genericLoginError:
  'Unable to log in. Check your information and try again.',
invalidCredentials:
  'The email address or password is incorrect.',
tooManyLoginAttempts:
  'Too many attempts were made. Wait a few minutes and try again.',
userDisabled:
  'This account has been disabled.',
networkError:
  'Check your Internet connection and try again.',
emailRequiredTitle: 'Email required',
emailRequiredMessage:
  'Enter your email address first.',
resetEmailSentTitle: 'Email sent',
resetEmailSentMessage:
  'Check your inbox for instructions to reset your password.',
resetErrorTitle: 'Reset error',
genericResetError:
  'The password reset email could not be sent. Check the address and try again.',
tooManyResetRequests:
  'Too many requests were made. Wait a few minutes and try again.',
}, 
registerScreen: {
  title: 'Create your account',
  subtitle:
    'Join LangBridge and start connecting through languages.',
  fullNameLabel: 'Full name',
  fullNamePlaceholder: 'Enter your full name',
  emailLabel: 'Email address',
  emailPlaceholder: 'Enter your email',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Create a password',
  confirmPasswordLabel: 'Confirm password',
  confirmPasswordPlaceholder: 'Confirm your password',
  createAccount: 'Create Account',
  terms:
    'By creating an account, you agree to the Terms of Service and Privacy Policy.',
  hasAccount: 'Already have an account?',
  login: 'Log in',
  accountCreatedTitle: 'Account created',
accountCreatedMessage:
  'Your LangBridge account was created successfully.',
continue: 'Continue',
googleErrorTitle:
  'Could not continue with Google',
tryAgain: 'Please try again.',
back: '‹ Back',
or: 'or',
continueWithGoogle: 'Continue with Google',
incompleteFieldsTitle: 'Incomplete fields',
incompleteFieldsMessage:
  'Complete all fields to create your account.',
invalidNameTitle: 'Invalid name',
invalidNameMessage: 'Enter your full name.',
invalidEmailTitle: 'Invalid email',
invalidEmailMessage:
  'Enter a valid email address.',
shortPasswordTitle: 'Password too short',
shortPasswordMessage:
  'The password must contain at least 6 characters.',
passwordsDoNotMatchTitle:
  'Passwords do not match',
passwordsDoNotMatchMessage:
  'Enter the same password in both fields.',
registrationErrorTitle:
  'Registration error',
genericRegistrationError:
  'The account could not be created. Try again.',
emailAlreadyRegistered:
  'This email address is already registered.',
weakPassword:
  'The password is too weak.',
networkError:
  'Check your Internet connection and try again.',
},
  },

  es: {
    chooseLanguage: {
      title: 'Elige tu idioma',
      subtitle: 'Selecciona el idioma que deseas usar en LangBridge.',
      english: 'Inglés',
      englishDescription: 'Usar LangBridge en inglés',
      spanish: 'Español',
      spanishDescription: 'Usar LangBridge en español',
      note:
        'Puedes cambiar el idioma de la interfaz más adelante en Configuración.',
      continue: 'Continuar',
      changeInterfaceLanguage:
  'Cambiar idioma de la interfaz',
comingSoon: 'PRONTO',
saveErrorTitle:
  'No se pudo guardar el idioma',
saveErrorMessage:
  'Revisa tu conexión e inténtalo nuevamente.',
loadingLanguage:
  'Cargando tu idioma...',
interfaceLanguage:
  'Idioma de la interfaz',
continuing:
  'Continuando...',
changeLater:
  'Podrás cambiar este idioma más adelante.',
    },
    welcome: {
      slogan: 'Practica. Conecta. Crece.',
      description:
        'Conecta con hablantes nativos, intercambia idiomas y crezcan juntos.',
      getStarted: 'Comenzar',
      login: 'Ya tengo una cuenta',
      footer: 'Crea conexiones reales a través del idioma',
    },
    homeScreen: {
  welcome: 'Bienvenido a LangBridge',
  subtitle: 'Tu viaje de aprendizaje de idiomas comienza aquí.',
  weeklyGoal: 'TU META SEMANAL',
  startPracticing: 'Comienza a practicar hoy',
  profileDescription: 'Completa tu perfil de idiomas para encontrar compañeros de aprendizaje compatibles.',
  profileProgress: 'Progreso del perfil',
  quickActions: 'Acciones rápidas',
  completeProfile: 'Completa tu perfil',
  completeProfileDescription: 'Agrega tu idioma nativo, el idioma que estás aprendiendo y tus intereses.',
  findPartners: 'Encuentra compañeros de idiomas',
  findPartnersDescription: 'Descubre personas que quieran intercambiar idiomas contigo.',
  conversations: 'Tus conversaciones',
  conversationsDescription: 'Continúa practicando con tus compañeros de idiomas.',
  learn: 'Aprender',
newBadge: 'NUEVO',
learnDescription:
  'Lecciones, niveles, puntos y práctica diaria.',
requests: 'Solicitudes',
requestsDescription:
  'Revisa y responde tus solicitudes de conexión.',
connections: 'Mis conexiones',
connectionsDescription:
  'Consulta las personas con quienes ya puedes practicar.',
profileAndSettings: 'Perfil y configuración',
profileAndSettingsDescription:
  'Administra tu cuenta, preferencias y sesión.',
  tipLabel: 'CONSEJO DE LANGBRIDGE',
  tipText: 'Un perfil completo te ayuda a encontrar compañeros de idiomas más confiables y compatibles.',
},
exploreScreen: {
  unspecified: 'No especificado',
  levelNotSpecified: 'Nivel no especificado',
  defaultUserName: 'Usuario de LangBridge',
  locationNotSpecified: 'Ubicación no indicada',
  countryNotSpecified: 'País no indicado',
  loadError:
    'No se pudieron cargar los compañeros.',
  back: '‹ Atrás',
  title: 'Encuentra compañeros',
  subtitle:
    'Conecta con personas que pueden ayudarte a practicar el idioma que estás aprendiendo.',
  searchPlaceholder:
    'Buscar por nombre, país o idioma',
  partnerFound: 'compañero encontrado',
  partnersFound: 'compañeros encontrados',
  allFilter: 'Todos',
  matchesFilter: '✨ Coincidencias',
  onlineFilter: '● En línea',
  findingPartners: 'Buscando compañeros...',
  profilesCouldNotBeLoaded:
    'No pudimos cargar los perfiles',
  noIdealMatchesFound:
    'Todavía no encontramos coincidencias ideales',
  noResultsFound: 'No encontramos resultados',
  noOtherPartners: 'Aún no hay otros compañeros',
  noIdealMatchesOnline:
    'No hay coincidencias ideales en línea en este momento. Puedes ver todas las coincidencias o todos los compañeros.',
  idealMatchesDescription:
    'Cuando encontremos una persona cuyos idiomas coincidan recíprocamente con los tuyos, aparecerá aquí.',
  tryAnotherSearch:
    'Prueba con otro nombre, país o idioma.',
  viewAllPartners: 'Ver todos los compañeros',
  idealMatchBadge: '✨ Coincidencia ideal',
speaks: 'Habla',
learns: 'Aprende',
},
conversationsScreen: {
  loginRequired:
    'Debes iniciar sesión nuevamente.',
  defaultPartnerName:
    'Compañero de LangBridge',
  timeLocale: 'es-DO',
  noMessagesYet:
    'Todavía no hay mensajes.',
  loadError:
    'No se pudieron cargar las conversaciones.',
  back: '‹ Atrás',
  title: 'Conversaciones',
  subtitle:
    'Continúa practicando con tus conexiones.',
  loading:
    'Cargando conversaciones...',
  loadErrorTitle:
    'No pudimos cargar las conversaciones',
  emptyTitle:
    'Todavía no tienes conversaciones',
  emptyDescription:
    'Abre una conexión y envía un mensaje para comenzar.',
},
chatScreen: {
  defaultPartnerName:
    'Compañero de LangBridge',
  preparationError:
    'No se pudo preparar esta conversación.',
  openError:
    'No se pudo abrir la conversación. Inténtalo nuevamente.',
  timeLocale: 'es-DO',
  messagesLoadError:
    'No se pudieron cargar los mensajes.',
  identificationError:
    'No se pudo identificar esta conversación.',
  sendError:
    'No se pudo enviar el mensaje. Revisa tu conexión e inténtalo nuevamente.',
  connectionStatus:
    'Conexión de idiomas',
  emptyTitle:
    'Comienza la conversación',
  emptyDescription:
    'Envía un mensaje a {partnerName} para comenzar a practicar.',
  seen: 'Visto',
  sent: 'Enviado',
  messagePlaceholder:
    'Escribe un mensaje...',
},
connectionsScreen: {
  loginRequired:
    'Debes iniciar sesión nuevamente.',
  defaultUserName:
    'Usuario de LangBridge',
  loadError:
    'No se pudieron cargar tus conexiones.',
  back: '‹ Atrás',
  title: 'Mis conexiones',
  subtitle:
    'Personas con quienes puedes practicar idiomas.',
  loading:
    'Cargando conexiones...',
  emptyTitle:
    'Todavía no tienes conexiones',
  emptyDescription:
    'Las solicitudes aceptadas aparecerán aquí.',
  acceptedConnection:
    'Conexión aceptada',
},
requestsScreen: {
  loginRequired:
    'Debes iniciar sesión nuevamente.',
  defaultUserName:
    'Usuario de LangBridge',
  loadError:
    'No se pudieron cargar las solicitudes.',
  acceptedTitle:
    'Solicitud aceptada',
  rejectedTitle:
    'Solicitud rechazada',
  acceptedMessage:
    'Ahora esta persona forma parte de tus conexiones.',
  rejectedMessage:
    'La solicitud fue rechazada correctamente.',
  responseErrorTitle:
    'No se pudo responder',
  responseErrorMessage:
    'No pudimos actualizar la solicitud. Revisa tu conexión e inténtalo nuevamente.',
  back: '‹ Atrás',
  title:
    'Solicitudes recibidas',
  subtitle:
    'Personas que desean conectar contigo para practicar idiomas.',
  loading:
    'Cargando solicitudes...',
  loadErrorTitle:
    'No pudimos cargar las solicitudes',
  emptyTitle:
    'No tienes solicitudes pendientes',
  emptyDescription:
    'Las nuevas solicitudes aparecerán aquí.',
  wantsToConnect:
    'Quiere conectar contigo.',
  pending: 'PENDIENTE',
  processing:
    'Procesando...',
  accept: 'Aceptar',
  reject: 'Rechazar',
},
blockedUsersScreen: {
  defaultUserName:
    'Usuario de LangBridge',
  loadErrorTitle:
    'No se pudieron cargar',
  connectionError:
    'Revisa tu conexión e inténtalo nuevamente.',
  unblockTitle:
    'Desbloquear usuario',
  unblockConfirmation:
    '¿Quieres desbloquear a {userName}?',
  cancel: 'Cancelar',
  unblock: 'Desbloquear',
  unblockSuccessTitle:
    'Usuario desbloqueado',
  unblockSuccessMessage:
    '{userName} fue desbloqueado.',
  unblockErrorTitle:
    'No se pudo desbloquear',
  back: '‹ Atrás',
  title:
    'Usuarios bloqueados',
  subtitle:
    'Administra las cuentas que bloqueaste en LangBridge.',
  loading:
    'Cargando usuarios bloqueados...',
  emptyTitle:
    'No tienes usuarios bloqueados',
  emptyDescription:
    'Las cuentas que bloquees aparecerán aquí.',
},
reportProblemScreen: {
  sessionUnavailableTitle:
    'Sesión no disponible',
  sessionUnavailableMessage:
    'Inicia sesión nuevamente para enviar el reporte.',
  selectCategoryTitle:
    'Selecciona una categoría',
  selectCategoryMessage:
    'Indica qué tipo de problema deseas reportar.',
  addMoreInformationTitle:
    'Agrega más información',
  addMoreInformationMessage:
    'La descripción debe tener al menos 10 caracteres.',
  reportSubmittedTitle:
    'Reporte enviado',
  reportSubmittedMessage:
    'Gracias. Revisaremos la información que enviaste.',
  submitErrorTitle:
    'No se pudo enviar',
  connectionError:
    'Revisa tu conexión e inténtalo nuevamente.',
  back: '‹ Atrás',
  title: 'Reportar un problema',
  subtitle:
    'Cuéntanos qué ocurrió para poder ayudarte.',
  problemType:
    'Tipo de problema',
  describeProblem:
    'Describe el problema',
  descriptionPlaceholder:
    'Explica qué ocurrió con el mayor detalle posible...',
  privateReportNotice:
  'Tu reporte se enviará de forma privada para su revisión.',
submitting: 'Enviando...',
submitReport: 'Enviar reporte',
categories: {
  technical: 'Problema técnico',
  account: 'Problema con mi cuenta',
  user: 'Reportar comportamiento',
  privacy: 'Privacidad o seguridad',
  other: 'Otro problema',
},
},

deleteAccountScreen: {
  requiredConfirmation: 'ELIMINAR',
  sessionUnavailableTitle:
    'Sesión no disponible',
  sessionUnavailableMessage:
    'Inicia sesión nuevamente para continuar.',
  incorrectConfirmationTitle:
    'Confirmación incorrecta',
  incorrectConfirmationMessage:
    'Escribe ELIMINAR para confirmar la solicitud.',
  confirmRequestTitle:
    'Confirmar solicitud',
  confirmRequestMessage:
    'Tu perfil se ocultará y se registrará una solicitud de eliminación.',
  cancel: 'Cancelar',
  continue: 'Continuar',
  requestSubmittedTitle:
    'Solicitud registrada',
  requestSubmittedMessage:
    'Tu perfil fue ocultado y la solicitud quedó registrada.',
  submitErrorTitle:
    'No se pudo registrar',
  connectionError:
    'Revisa tu conexión e inténtalo nuevamente.',
  back: '‹ Atrás',
  title: 'Eliminar cuenta',
  subtitle:
    'Solicita la eliminación permanente de tu cuenta de LangBridge.',
  warningTitle:
    'Antes de continuar',
  warningText:
    'Esta solicitud ocultará inmediatamente tu perfil mientras se procesa la eliminación.',
  consequencesTitle:
    'La eliminación puede afectar:',
  profileConsequence:
    '• Tu perfil y preferencias.',
  connectionsConsequence:
    '• Tus solicitudes y conexiones.',
  conversationsConsequence:
    '• Tus conversaciones y mensajes.',
  accessConsequence:
    '• Tu acceso futuro a LangBridge.',
  confirmationLabel:
    'Para confirmar, escribe ELIMINAR',
  helperText:
    'La palabra debe escribirse exactamente como aparece arriba.',
  processing:
    'Procesando solicitud...',
  requestDeletion:
    'Solicitar eliminación',
  cancelAndKeepAccount:
    'Cancelar y conservar mi cuenta',
  securityNote:
    'Por seguridad, la eliminación definitiva requerirá una verificación adicional de identidad.',
},
privacySecurityScreen: {
  emailUnavailableTitle:
    'Correo no disponible',
  emailUnavailableMessage:
    'No encontramos un correo asociado a esta cuenta.',
  changePasswordTitle:
    'Cambiar contraseña',
  changePasswordMessage:
    'Enviaremos un enlace de cambio de contraseña a {email}.',
  cancel:
    'Cancelar',
  sendEmail:
    'Enviar correo',
  emailSentTitle:
    'Correo enviado',
  emailSentMessage:
    'Revisa tu bandeja de entrada y la carpeta de correo no deseado.',
  sendErrorTitle:
    'No se pudo enviar',
  connectionError:
    'Revisa tu conexión e inténtalo nuevamente.',
  comingSoonTitle:
    'Función en desarrollo',
  comingSoonMessage:
    'Esta opción estará disponible próximamente.',
  sessionUnavailableTitle:
    'Sesión no disponible',
  sessionUnavailableMessage:
    'Inicia sesión nuevamente para cambiar esta opción.',
  visibilityUpdatedTitle:
    'Visibilidad actualizada',
  profileVisibleMessage:
    'Otras personas podrán encontrar tu perfil.',
  profileHiddenMessage:
    'Tu perfil dejará de aparecer en las búsquedas.',
  saveErrorTitle:
    'No se pudo guardar',
  back:
    '‹ Atrás',
  title:
    'Privacidad y seguridad',
  subtitle:
    'Administra la seguridad y privacidad de tu cuenta.',
  accountSecurityTitle:
    'Seguridad de la cuenta',
  changePassword:
    'Cambiar contraseña',
  changePasswordDescription:
    'Actualiza la contraseña de acceso.',
  blockedUsers:
    'Usuarios bloqueados',
  blockedUsersDescription:
    'Administra las cuentas que bloqueaste.',
  profilePrivacyTitle:
    'Privacidad del perfil',
  visibleProfile:
    'Perfil visible',
  visibleProfileDescription:
    'Permite que otras personas encuentren tu perfil.',
  helpAndControlTitle:
    'Ayuda y control',
  reportProblem:
    'Reportar un problema',
  reportProblemDescription:
    'Reporta comportamientos inapropiados o fallos.',
  deleteAccount:
    'Eliminar cuenta',
  deleteAccountDescription:
    'Elimina permanentemente tu cuenta y tus datos.',
},
editProfileScreen: {
  photoUnavailableTitle:
    'Foto no disponible',
  photoUnavailableMessage:
    'Esta cuenta no tiene una foto de Google disponible.',
  removePhotoTitle:
    'Eliminar foto',
  removePhotoMessage:
    'Se mostrarán las iniciales de tu nombre.',
  cancel:
    'Cancelar',
  remove:
    'Eliminar',
  loginRequiredTitle:
    'Sesión requerida',
  loginRequiredMessage:
    'Debes iniciar sesión nuevamente para actualizar tu perfil.',
  nameRequiredTitle:
    'Nombre requerido',
  nameRequiredMessage:
    'Escribe tu nombre completo para continuar.',
  countryRequiredTitle:
    'País requerido',
  countryRequiredMessage:
    'Selecciona tu país para continuar.',
  profileUpdatedTitle:
    'Perfil actualizado',
  profileUpdatedMessage:
    'Tus cambios fueron guardados correctamente.',
  saveFailedTitle:
    'No se pudo guardar',
  connectionError:
    'Revisa tu conexión e inténtalo nuevamente.',
  back:
    '‹ Atrás',
  title:
    'Editar perfil',
  subtitle:
    'Actualiza la información que verán tus compañeros.',
  profilePhoto:
    'Foto de perfil',
  changePhoto:
    'Cambiar foto',
  changePhotoMessage:
    'Conectaremos la galería del teléfono en el siguiente paso.',
  useGooglePhoto:
    'Usar foto de Google',
  removePhoto:
    'Eliminar foto',
  fullName:
    'Nombre completo',
  fullNamePlaceholder:
    'Escribe tu nombre',
  country:
    'País',
  selectCountry:
    'Selecciona tu país',
  countryPrivacyHelper:
    'Solo mostraremos tu país públicamente.',
  searchCountry:
    'Buscar país...',
  noCountryResults:
    'No encontramos ese país.',
  aboutMe:
    'Acerca de mí',
  bioPlaceholder:
    'Cuéntales qué te interesa practicar.',
  saving:
    'Guardando...',
  saveChanges:
    'Guardar cambios',
},
settingsScreen: {
  defaultUserName: 'Usuario de LangBridge',
  emailUnavailable: 'Correo no disponible',
  signOutTitle: 'Cerrar sesión',
  signOutConfirmation:
    '¿Estás seguro de que deseas cerrar tu sesión?',
  cancel: 'Cancelar',
  signOut: 'Cerrar sesión',
  signOutErrorTitle:
    'No se pudo cerrar la sesión',
  tryAgain: 'Inténtalo nuevamente.',
  back: '‹ Atrás',
  title: 'Perfil y configuración',
  subtitle:
    'Administra tu cuenta y tus preferencias.',
  accountSection: 'Cuenta',
  editProfile: 'Editar perfil',
  editProfileDescription:
    'Nombre, ubicación e información personal.',
  viewPublicProfile:
    'Ver mi perfil público',
  viewPublicProfileDescription:
    'Comprueba cómo otras personas ven tu perfil.',
  changeInterfaceLanguage:
    'Cambiar idioma de la interfaz',
  interfaceLanguage:
    'Idioma de la interfaz',
  interfaceLanguageDescription:
    'Cambia el idioma de los textos y menús de LangBridge.',
  languagesAndLevel:
    'Idiomas y nivel',
  languagesAndLevelDescription:
    'Actualiza tu perfil lingüístico.',
  privacyAndSecurity:
    'Privacidad y seguridad',
  privacyAndSecurityDescription:
    'Bloqueos, reportes y controles de cuenta.',
},
tabs: {
  home: 'Inicio',
  explore: 'Explorar',
  conversations: 'Chats',
  settings: 'Perfil',
},
lessonScreen: {
  exerciseProgress: 'EJERCICIO 1 DE 3',
  title: 'Elige la traducción correcta',
  question:
    '¿Cómo se dice “Hola” en inglés?',
  answerChecked: 'Respuesta comprobada',
  check: 'Comprobar',
},
learnScreen: {
  back: '‹ Atrás',
  title: 'Aprender',
  subtitle:
    'Avanza con lecciones breves y práctica diaria.',
  streak: 'Racha',
  points: 'Puntos',
  lives: 'Vidas',
  dailyGoal: 'Meta diaria',
  dailyGoalDescription:
    'Completa una lección hoy',
  unitOneTitle:
    'Unidad 1: Primeros pasos',
  unitOneDescription:
    'Aprende saludos y expresiones esenciales.',
  lessonOneAvailable:
    'Lección 1 disponible',
},
googleAuth: {
  missingWebClientId:
    'Falta configurar el Web Client ID de Google.',
  invalidIdToken:
    'Google no devolvió un token válido.',
},
    loginScreen: {
  title: 'Bienvenido de nuevo',
  subtitle:
    'Inicia sesión para continuar practicando y conectando a través de los idiomas.',
  emailLabel: 'Correo electrónico',
  emailPlaceholder: 'Escribe tu correo electrónico',
  passwordLabel: 'Contraseña',
  passwordPlaceholder: 'Escribe tu contraseña',
  forgotPassword: '¿Olvidaste tu contraseña?',
  loginButton: 'Iniciar sesión',
  noAccount: '¿No tienes una cuenta?',
  createOne: 'Crear una',
  back: '‹ Atrás',
or: 'o',
continueWithGoogle: 'Continuar con Google',
googleErrorTitle:
  'No se pudo continuar con Google',
tryAgain: 'Inténtalo nuevamente.',
incompleteFieldsTitle: 'Campos incompletos',
incompleteFieldsMessage:
  'Escribe tu correo electrónico y contraseña.',
invalidEmailTitle: 'Correo no válido',
invalidEmailMessage:
  'Escribe una dirección de correo electrónico válida.',
loginErrorTitle: 'Error al iniciar sesión',
genericLoginError:
  'No fue posible iniciar sesión. Verifica tus datos e inténtalo nuevamente.',
invalidCredentials:
  'El correo electrónico o la contraseña son incorrectos.',
tooManyLoginAttempts:
  'Se realizaron demasiados intentos. Espera unos minutos e inténtalo nuevamente.',
userDisabled:
  'Esta cuenta ha sido deshabilitada.',
networkError:
  'Revisa tu conexión a Internet e inténtalo nuevamente.',
emailRequiredTitle: 'Correo requerido',
emailRequiredMessage:
  'Escribe primero tu dirección de correo electrónico.',
resetEmailSentTitle: 'Correo enviado',
resetEmailSentMessage:
  'Revisa tu bandeja de entrada para restablecer tu contraseña.',
resetErrorTitle: 'Error de recuperación',
genericResetError:
  'No se pudo enviar el correo de recuperación. Verifica la dirección e inténtalo nuevamente.',
tooManyResetRequests:
  'Se realizaron demasiadas solicitudes. Espera unos minutos e inténtalo nuevamente.',
  },
  registerScreen: {
  title: 'Crea tu cuenta',
  subtitle:
    'Únete a LangBridge y comienza a conectar a través de los idiomas.',
  fullNameLabel: 'Nombre completo',
  fullNamePlaceholder: 'Escribe tu nombre completo',
  emailLabel: 'Correo electrónico',
  emailPlaceholder: 'Escribe tu correo electrónico',
  passwordLabel: 'Contraseña',
  passwordPlaceholder: 'Crea una contraseña',
  confirmPasswordLabel: 'Confirmar contraseña',
  confirmPasswordPlaceholder: 'Confirma tu contraseña',
  createAccount: 'Crear cuenta',
  terms:
    'Al crear una cuenta, aceptas los Términos de servicio y la Política de privacidad.',
  hasAccount: '¿Ya tienes una cuenta?',
  login: 'Iniciar sesión',
  accountCreatedTitle: 'Cuenta creada',
accountCreatedMessage:
  'Tu cuenta de LangBridge fue creada correctamente.',
continue: 'Continuar',
googleErrorTitle:
  'No se pudo continuar con Google',
tryAgain: 'Inténtalo nuevamente.',
back: '‹ Atrás',
or: 'o',
continueWithGoogle: 'Continuar con Google',
incompleteFieldsTitle: 'Campos incompletos',
incompleteFieldsMessage:
  'Completa todos los campos para crear tu cuenta.',
invalidNameTitle: 'Nombre no válido',
invalidNameMessage: 'Escribe tu nombre completo.',
invalidEmailTitle: 'Correo no válido',
invalidEmailMessage:
  'Escribe una dirección de correo electrónico válida.',
shortPasswordTitle: 'Contraseña muy corta',
shortPasswordMessage:
  'La contraseña debe tener por lo menos 6 caracteres.',
passwordsDoNotMatchTitle:
  'Las contraseñas no coinciden',
passwordsDoNotMatchMessage:
  'Escribe la misma contraseña en ambos campos.',
registrationErrorTitle:
  'Error de registro',
genericRegistrationError:
  'No se pudo crear la cuenta. Inténtalo nuevamente.',
emailAlreadyRegistered:
  'Este correo electrónico ya está registrado.',
weakPassword:
  'La contraseña es demasiado débil.',
networkError:
  'Revisa tu conexión a Internet e inténtalo nuevamente.',
},
},
};
