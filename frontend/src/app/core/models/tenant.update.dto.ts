export interface TenantUpdateDto {
  name?: string;
  blocked?: boolean;
  mailReaderStopping?: boolean;
  googleDocAIEnabled?: boolean;
  googleTranslationEnabled?: boolean;
  masterDataCacheEnabled?: boolean;
  externalReporting?: boolean;
}
