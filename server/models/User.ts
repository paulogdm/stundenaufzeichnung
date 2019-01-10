import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm"
import UserTask from "./UserTask"

@Entity()
export default class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string

  @Column()
  lastname: string

  @Column({ nullable: true })
  isDriver: boolean

  @OneToMany(type => UserTask, userTask => userTask.user)
  userTasks: UserTask[]
}
