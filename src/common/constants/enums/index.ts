export enum ENVIRONMENTS {
  LOCAL = 'local',
  DEV = 'dev',
  PROD = 'prod',
}

export const enum ORDER_BY {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum ROLE_ID {
  'PARTNER' = <number>1,
  'CUSTOMER' = <number>2,
  'SUPPLIER' = <number>3,
}

export enum ROLE_NAME {
  'PARTNER' = 'Partner',
  'CUSTOMER' = 'Customer',
  'SUPPLIER' = 'Supplier',
}

export enum EMAIL_VERIFICATION_TOKEN_STATUS {
  USED = 'used',
  UNUSED = 'unused',
  EXPIRED = 'expired',
}

export enum EMAIL_VERIFICATION_TOKEN_TYPE {
  VERIFICATION = 'verification',
  PASSWORD_RESET = 'password_reset',
  INVITE = 'invite',
}

export enum LENGTH_OF_STAY_UNIT {
  DAYS = 'days',
  MONTHS = 'months',
  YEARS = 'years',
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
  WEEK = 'week',
  WEEKS = 'weeks',
}

export enum VISA_REQUIREMENT_STATUS {
  ON_ARRIVAL = 'on_arrival',
  NOT_FACILITATED = 'not_facilitated',
  REQUIRED = 'required',
}

export enum DOCUMENT_REQUIREMENT {
  MANDATORY = 'mandatory',
  OPTIONAL = 'optional',
}

export enum SUPPLIER_CHARGE_TYPE {
  ALL = 'all',
  SPECIFIC = 'specific',
}

export enum DATE_TYPE {
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}
export enum IMAGE_TYPES {
  AVATAR = '.(png|jpg|jpeg)',
}
export enum MAX_FILE_SIZES {
  AVATAR = 1024 * 1024 * 5,
}
export enum PROVIDERS {
  AWS_S3 = 'AWS_S3',
}
export enum AWS_COMMANDS {
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
  LIST = 'LIST',
  HEAD = 'HEAD',
  POST = 'POST',
}
export enum TIME_IN_SECONDS {
  ONE_DAY = 86400,
  ONE_WEEK = 604800,
  ONE_MONTH = 2592000,
  ONE_YEAR = 31536000,
}
export enum AWS_BUCKETS {
  DUMMY = 'DUMMY',
}
export enum BASE_64_URLS {
  DUMMY = 'DUMMY',
  SCAN = 'https://base64.ai/api/scan',
}
