import { BeforeCreate, BeforeUpdate, BelongsTo, BelongsToMany, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import { User } from "./user";
import { DocType, DocTypeField } from "./docType";

@Table
export class Field extends Model {

    @ForeignKey(() => User)
    @Column
    userId!: number;

    @Column
    name!: string;

    @Column
    snakeName!: string

    @Column(DataType.TEXT)
    description!: string;

    @CreatedAt
    createdAt!: string;

    @UpdatedAt
    updatedAt!: string;

    @BeforeCreate
    @BeforeUpdate
    static createSnakeCaseName(field: Field){
        if(field.changed('name')){
            const snakeName = field.get('name').replace(/\s+/g, '_')
            .replace(/[^\w\s]/g, '')
            .toLowerCase()
            field.snakeName = snakeName
        }
    }

    @BelongsTo(() => User)
    user!: User;
    
    @BelongsToMany(() => DocType, () => DocTypeField)
    docTypes!: DocType[];
  
}