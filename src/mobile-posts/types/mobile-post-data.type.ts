export interface MobilePostData {
  mobileCode?: string;
  seq?: number;
  nameEN?: string;
  nameTC?: string;
  nameSC?: string;
  districtEN?: string;
  districtTC?: string;
  districtSC?: string;
  locationEN?: string;
  locationTC?: string;
  locationSC?: string;
  addressEN?: string;
  addressTC?: string;
  addressSC?: string;
  openHour?: string;
  closeHour?: string;
  dayOfWeekCode?: number;
  // Allow both string and number for coordinates to handle raw data
  latitude?: string | number;
  longitude?: string | number;
}
