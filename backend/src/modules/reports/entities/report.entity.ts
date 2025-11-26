import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('reports')
export class ReportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id', type: 'varchar', length: 100 })
  project_id: string;

  @Column({ name: 'phone_hash', type: 'varchar', length: 255, nullable: true })
  phone_hash: string;

  @Column({ name: 'ip_hash', type: 'varchar', length: 255, nullable: true })
  ip_hash: string;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'photo_url', type: 'varchar', length: 500, nullable: true })
  photo_url?: string;

  @Column({ type: 'json', nullable: true })
  location: {
    lat: number;
    lng: number;
    address: string;
  };

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ type: 'varchar', length: 50 })
  source: string;

  @Column({ type: 'integer', default: 0 })
  score: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}