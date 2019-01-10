import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany} from "typeorm"
import UserTask from "./Task"

@Entity()
export default class Task extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string

  @Column({ nullable: true })
  frequency: number

  @Column({ nullable: true })
  region: string

  @OneToMany(type => UserTask, task => task.userTasks)
  userTasks: UserTask[]
}
