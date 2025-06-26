export interface License {
  license: string;
  email: string;
}

export type ValidateLicenseReq = {
  email: string;
  licenseCode: string;
  deviceId: string;
};
