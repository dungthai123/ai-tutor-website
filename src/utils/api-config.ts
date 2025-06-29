export const API_CONFIG = {
  STAGING_BASE_URL: 'https://trumchinese-staging.hackinglanguage.com',
  API_KEY: 'think_ai_lab',
  
  HEADERS: {
    X_API_KEY: 'x-api-key',
    LOCATION: 'location',
    AUTHORIZATION: 'Authorization',
  },
  
  HEADER_VALUES: {
    API_KEY: 'think_ai_lab',
    LOCALE_VI: 'vi',
    LOCALE_EN: 'en',
    LOCALE_ZH_CN: 'zh-Hans',
    LOCALE_ZH_TW: 'zh-Hant',
  }
};

export const getBaseUrl = (): string => {
  // In production, you might want to get this from Firebase Remote Config
  // For now, we'll use the staging URL
  return process.env.NEXT_PUBLIC_API_BASE_URL || API_CONFIG.STAGING_BASE_URL;
};

export const getDefaultLanguage = (): string => {
  // Get from localStorage or browser language, fallback to English
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('language') || 
                         navigator.language.substring(0, 2);
    
    switch (savedLanguage) {
      case 'vi':
        return API_CONFIG.HEADER_VALUES.LOCALE_VI;
      case 'zh':
        return API_CONFIG.HEADER_VALUES.LOCALE_ZH_CN;
      default:
        return API_CONFIG.HEADER_VALUES.LOCALE_EN;
    }
  }
  return API_CONFIG.HEADER_VALUES.LOCALE_EN;
}; 