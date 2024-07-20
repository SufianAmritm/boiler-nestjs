/** */
export const PROJECT_NAME = 'Propellus Backend 🚀';
export const JWT = 'JWT';
export const X_API_KEY = 'x-api-key';
export const PAGE_SIZE = 10;
export const DEFLAUT_PAGE = 1;

export const RESPONSE_MESSAGES = {
  INTERNAL_SERVER_ERROR:
    "We're sorry, but our server encountered an unexpected error while processing your request. Please try again later, or contact our support team if the problem persists.",
  UPDATED: 'Successfully updated',
  DELETED: 'Successfully deleted',
  IN_ACTIVATED: 'Successfully inactivated',
  ACTIVATED: 'Successfully activated',
  VERIFY: 'Successfully verified',
  CREATED: 'Successfully created',
  VERIFICATION: 'Verification email sent successfully',
  SIGN_IN: 'Successfully signed in',
  RESET_PASSWORD_EMAIL: 'Reset password email sent successfully',
  RESET_PASSWORD: 'Password reset successfully',
  ALREADY_SENT_SENT_VERIFICATION:
    'Email has already been sent for verification. Please check your email',
};

export const DUMMY_DATA = {
  email: 'user@gmail.com',
  password: 'i*RyNx7YCckM2*',
  name: 'Propellus-Partner-1',
  roleName: 'Dummy Role',
  token: 'eyJhbGci',
  charge: 17,
  VisaEntryTypeName: 'Dummy Visa Entry Type',
  VisaTypeName: 'Dummy Visa Type',
  ProcessingPriorityName: 'Dummy Processing Priority',
  ChargeStructureName: 'Dummy Charge Structure',
};

export const DOMAIN_ENTITY = {
  USER: 'User',
  ROLE: 'Role',
  TENANT: 'Tenant',
  VISA_TYPE: 'Visa Type',
  VISA_CONFIGURATION: 'Visa Configuration',
  VISA_ENTRY_TYPE: 'Visa Entry Type',
  VISA_STAY_DURATION: 'Visa Stay Duration',
  VISA_PROCESSING_PRIORITY: 'Visa Processing Priority',
  VISA_CHARGE_STRUCTURE: 'Visa Charge Structure',
  DOCUMENT_LIBRARY: 'Document Library',
  TENANT_RESIDENCY: 'Tenant Residency',
  SUPPLIER: 'Supplier',
  SUPPLIER_CHARGE: 'Supplier Charge',
  TENANT_DESTINATION: 'Tenant Destination',
};
export const VISA_DURATION_TYPES = {
  DAYS: 'days',
};

export const EMAIL_SUBJECT = {
  VERIFICATION: 'Verify Your Propellus Account',
  RESET_PASSWORD: 'Reset Your Propellus Password',
};
export const CRON_JOB_NAME = {
  CHECK_SERVER_HEALTH: 'SERVER_HEALTH',
};
export declare const APP_GUARD = 'APP_GUARD';
