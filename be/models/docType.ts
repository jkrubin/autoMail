import { BelongsTo, BelongsToMany, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import { DocTypeField } from "./docTypeField";
import { Field } from "./field";
import { User } from "./user";

@Table
export class DocType extends Model {

    @ForeignKey(() => User)
    @Column
    userId!: number;

    @Column
    name!: string;

    @Column(DataType.TEXT)
    description!: string

    @CreatedAt
    createdAt!: string;

    @UpdatedAt
    updatedAt!: string;

    @BelongsTo(() => User)
    user!: User;

    @BelongsToMany(() => Field, () => DocTypeField)
    fields!: Field[];
  
}