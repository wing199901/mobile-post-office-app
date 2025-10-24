/**
 * Response type when lang='all'
 * Returns all language-specific fields plus language-neutral default fields
 */
export interface MobilePostResponseAll {
  id: number;
  mobileCode: string | null;
  seq: number | null;
  name: string;
  nameEN: string | null;
  nameTC: string | null;
  nameSC: string | null;
  district: string;
  districtEN: string | null;
  districtTC: string | null;
  districtSC: string | null;
  location: string;
  locationEN: string | null;
  locationTC: string | null;
  locationSC: string | null;
  address: string;
  addressEN: string | null;
  addressTC: string | null;
  addressSC: string | null;
  openHour: string | null;
  closeHour: string | null;
  dayOfWeekCode: number | null;
  latitude: string | null;
  longitude: string | null;
}

/**
 * Response type when lang='en'|'tc'|'sc'
 * Returns only language-neutral field names with values in requested language
 */
export interface MobilePostResponseSingle {
  id: number;
  mobileCode: string | null;
  seq: number | null;
  name: string;
  district: string;
  location: string;
  address: string;
  openHour: string | null;
  closeHour: string | null;
  dayOfWeekCode: number | null;
  latitude: string | null;
  longitude: string | null;
}

/**
 * Union type for mobile post responses
 */
export type MobilePostResponse =
  | MobilePostResponseAll
  | MobilePostResponseSingle;
