import emailValidator from "email-validator";

export type IEmailData = {
  [key: string]: string | undefined;
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone?: string;
};

export const isIEmailData = (data: any): data is IEmailData => {
  if (
    typeof data !== "object" ||
    typeof data.firstName !== "string" ||
    data.firstName.trim().length <= 0 ||
    typeof data.lastName !== "string" ||
    data.lastName.trim().length <= 0 ||
    (data.companyName !== undefined && typeof data.companyName !== "string") ||
    (data.companyName !== undefined && data.companyName.length <= 0) ||
    typeof data.email !== "string" ||
    data.email.trim().length <= 0 ||
    emailValidator.validate(data.email) ||
    (data.phone !== undefined && typeof data.phone !== "string")
  ) {
    return false;
  }

  return true;
};
