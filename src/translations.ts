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
},
},
};
