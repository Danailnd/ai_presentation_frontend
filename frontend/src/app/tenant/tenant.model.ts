export interface Tenant {
  id?: string;
  name: string;
  domain: string;
  locked: boolean;
  tenantType: string;
  creationDate: string;
  country: string;
  isActive: boolean;
  userCount: number;
  lastModified: string;
}
