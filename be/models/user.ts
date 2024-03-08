import { Table, Model, Column, UpdatedAt, CreatedAt, BeforeCreate, BeforeUpdate, Unique, DataType } from 'sequelize-typescript'
import { Col } from 'sequelize/types/utils';
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10
@Table
export class User extends Model {

    @Unique
    @Column
    email!: string

    @Column
    password!: string

    @Column(DataType.TEXT)
    jwt!:string

    @CreatedAt
    @Column
    createdAt!: Date
    
    @UpdatedAt
    @Column
    updatedAt!: Date

    @BeforeCreate
    @BeforeUpdate
    static hashPassword(user: User) {
        if(user.changed('password')){
            console.log("\n~~~~~\nSALTING PASSWORD\n~~~~~~~\n")
            const salt = bcrypt.genSaltSync(SALT_ROUNDS)
            user.password = bcrypt.hashSync(user.password, salt)
        }
    }

    comparePassword(password:string) {
        return  bcrypt.compareSync(password, this.password)
    }

}