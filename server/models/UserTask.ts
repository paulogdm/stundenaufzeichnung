import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from "typeorm"
import User from "./User"
import Task from "./Task"
import {Moment} from "moment"

@Entity()
export default class UserTask extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User)
  user: User

  @ManyToOne(type => Task)
  task: Task

  @Column("date")
  executedAt: Moment

  @Column()
  hours: number

}
