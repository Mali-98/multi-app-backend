import { Role } from 'src/auth/decorator/roles.enum';
import { Entity, ObjectIdColumn, ObjectId, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
    @ObjectIdColumn() // Use ObjectIdColumn for MongoDB
    id: ObjectId; // Change the type to ObjectID

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
    })
    role: Role;
}
