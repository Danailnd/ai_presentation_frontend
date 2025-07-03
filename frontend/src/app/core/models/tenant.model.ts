export interface Tenant {
  id: string;
  name: string;
  blocked: boolean;
  mailReaderStopping: boolean;
  googleDocAIEnabled: boolean;
  googleTranslationEnabled: boolean;
  masterDataCacheEnabled: boolean;
  externalReporting: boolean;
  dbname: string;
}
