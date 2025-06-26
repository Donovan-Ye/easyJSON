import request from "../request";
import { License, ValidateLicenseReq } from "./type";

export function validateLicense(data: ValidateLicenseReq) {
  return request<License>({
    method: "POST",
    url: "/license/validate-license",
    data,
  });
}
