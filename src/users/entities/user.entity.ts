import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
    @PrimaryColumn()
    id: string; // Change the type to string

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    role: string; // e.g., 'admin', 'vendor', 'rider'
}
