import { Table, Model, Column, UpdatedAt, CreatedAt, BeforeCreate, BeforeUpdate, Unique, DataType, HasMany } from 'sequelize-typescript'
import bcrypt from 'bcrypt'
import { DocType } from './docType'
import { Field } from './field'

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

    @HasMany(() => DocType)
    docTypes!: DocType[]

    @HasMany(() => Field)
    fields!: Field[]
    
    @BeforeCreate
    @BeforeUpdate
    static hashPassword(user: User) {
        if(user.changed('password')){
            const salt = bcrypt.genSaltSync(SALT_ROUNDS)
            user.password = bcrypt.hashSync(user.password, salt)
        }
    }

    comparePassword(password:string) {
        return  bcrypt.compareSync(password, this.password)
    }

}