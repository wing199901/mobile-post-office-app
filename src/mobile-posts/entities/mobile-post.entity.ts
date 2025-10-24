import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mobile_posts')
export class MobilePost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  mobileCode: string;

  @Column({ type: 'int', nullable: true })
  seq: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nameEN: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nameTC: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nameSC: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  districtEN: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  districtTC: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  districtSC: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  locationEN: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  locationTC: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  locationSC: string;

  @Column({ type: 'text', nullable: true })
  addressEN: string;

  @Column({ type: 'text', nullable: true })
  addressTC: string;

  @Column({ type: 'text', nullable: true })
  addressSC: string;

  @Column({ type: 'char', length: 5, nullable: true })
  openHour: string;

  @Column({ type: 'char', length: 5, nullable: true })
  closeHour: string;

  @Column({ type: 'tinyint', nullable: true })
  dayOfWeekCode: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @CreateDateColumn({ name: 'imported_at' })
  importedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
