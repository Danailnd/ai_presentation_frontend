import { Tenant } from '../models/tenant.model';
import { TenantUpdateDto } from '../models/tenant.update.dto';

export function toTenantUpdateDto(
  original: Tenant,
  current: Tenant
): TenantUpdateDto {
  const dto: TenantUpdateDto = {};

  if (original.name !== current.name) {
    dto.name = current.name;
  }

  if (original.blocked !== current.blocked) {
    dto.blocked = current.blocked;
  }

  if (original.mailReaderStopping !== current.mailReaderStopping) {
    dto.mailReaderStopping = current.mailReaderStopping;
  }

  if (original.googleDocAIEnabled !== current.googleDocAIEnabled) {
    dto.googleDocAIEnabled = current.googleDocAIEnabled;
  }

  if (original.googleTranslationEnabled !== current.googleTranslationEnabled) {
    dto.googleTranslationEnabled = current.googleTranslationEnabled;
  }

  if (original.masterDataCacheEnabled !== current.masterDataCacheEnabled) {
    dto.masterDataCacheEnabled = current.masterDataCacheEnabled;
  }

  if (original.externalReporting !== current.externalReporting) {
    dto.externalReporting = current.externalReporting;
  }
  return dto;
}
