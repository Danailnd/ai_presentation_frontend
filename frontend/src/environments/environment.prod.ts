export const environment = {
  production: true,
  msalConfig: {
    auth: {
      clientId: 'deaab351-dc7f-40f6-b2f1-71dc8663deb3',
      authority:
        'https://login.microsoftonline.com/31886941-8a86-4f93-8f42-d140eaea36ad',
      redirectUri:
        'http://test-ops-ui-hfedh9b2hteth4er.switzerlandnorth-01.azurewebsites.net/',
      postLogoutRedirectUri:
        'http://test-ops-ui-hfedh9b2hteth4er.switzerlandnorth-01.azurewebsites.net/',
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: true,
    },
  },

  apiConfig: {
    scopes: ['api://deaab351-dc7f-40f6-b2f1-71dc8663deb3/access-ops-ui-api'],
    uri: '/api/',
  },
};
