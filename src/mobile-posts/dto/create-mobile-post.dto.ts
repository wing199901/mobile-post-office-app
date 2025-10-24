import {
  IsString,
  IsInt,
  IsOptional,
  Matches,
  Min,
  Max,
  IsNumber,
} from 'class-validator';

export class CreateMobilePostDto {
  @IsOptional()
  @IsString()
  mobileCode?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  seq?: number;

  @IsOptional()
  @IsString()
  nameEN?: string;

  @IsOptional()
  @IsString()
  nameTC?: string;

  @IsOptional()
  @IsString()
  nameSC?: string;

  @IsOptional()
  @IsString()
  districtEN?: string;

  @IsOptional()
  @IsString()
  districtTC?: string;

  @IsOptional()
  @IsString()
  districtSC?: string;

  @IsOptional()
  @IsString()
  locationEN?: string;

  @IsOptional()
  @IsString()
  locationTC?: string;

  @IsOptional()
  @IsString()
  locationSC?: string;

  @IsOptional()
  @IsString()
  addressEN?: string;

  @IsOptional()
  @IsString()
  addressTC?: string;

  @IsOptional()
  @IsString()
  addressSC?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'openHour must be in HH:MM format with valid time (00:00-23:59)',
  })
  openHour?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'closeHour must be in HH:MM format with valid time (00:00-23:59)',
  })
  closeHour?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeekCode?: number;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;
}
