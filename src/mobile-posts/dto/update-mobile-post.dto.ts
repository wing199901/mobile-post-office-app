import { PartialType } from '@nestjs/mapped-types';
import { CreateMobilePostDto } from './create-mobile-post.dto';

export class UpdateMobilePostDto extends PartialType(CreateMobilePostDto) {}
