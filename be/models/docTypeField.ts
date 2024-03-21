import { BelongsToMany, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import { DocType } from "./docType";
import { Field } from "./field";


@Table
export class DocTypeField extends Model {
    @ForeignKey(() => DocType)
    @Column
    bookId!: number;

    @ForeignKey(() => Field)
    @Column
    authorId!: number;
}

