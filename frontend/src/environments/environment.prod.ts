export const environment = {
  production: true,
  msalConfig: {
    auth: {
      clientId: '4f57e63f-105b-43ca-afd3-89ad166e3cd7',
      authority:
        'https://login.microsoftonline.com/31886941-8a86-4f93-8f42-d140eaea36ad/v2.0',
      redirectUri:
        'https://ops-ui-gbbygqenhgguceeb.francecentral-01.azurewebsites.net/',
      postLogoutRedirectUri:
        'https://ops-ui-gbbygqenhgguceeb.francecentral-01.azurewebsites.net/',
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: true,
    },
  },

  apiConfig: {
    scopes: ['api://4f57e63f-105b-43ca-afd3-89ad166e3cd7/default'],
    uri: 'https://ops-ui-api-fch9cchzfweeaagw.canadacentral-01.azurewebsites.net/api/',
  },
};
