import { BelongsTo, BelongsToMany, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import { DocType } from "./docType";
import { DocTypeField } from "./docTypeField";
import { User } from "./user";

@Table
export class Field extends Model {

    @ForeignKey(() => User)
    @Column
    userId!: number;

    @Column
    name!: string;

    @Column(DataType.TEXT)
    description!: string;

    @CreatedAt
    createdAt!: string;

    @UpdatedAt
    updatedAt!: string;

    @BelongsTo(() => User)
    user!: User;
    
    @BelongsToMany(() => DocType, () => DocTypeField)
    docTypes!: DocType[];
  
}