import { Column, CreatedAt, DataType, ForeignKey, Model, UpdatedAt } from "sequelize-typescript";
import { Field } from "./field";
import { User } from "./user";
import { DocType } from "./doctype";

export class DocTypeField extends Model {
    @ForeignKey(() => DocType)
    @Column
    docTypeId!: number;

    @ForeignKey(() => Field)
    @Column
    extractFieldId!: number;

    // @ForeignKey(() => User)
    // @Column({ type: DataType.INTEGER, primaryKey: true })
    // userId!: number;

    @CreatedAt
    createdAt!: number;

    @UpdatedAt
    updatedAt!: number;
}