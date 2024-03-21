import { BelongsToMany, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript'
import { DocTypeField } from './docTypeField';
import { DocType } from './doctype';

@Table
export class Field extends Model {

    @Column
    name!: string;

    @Column(DataType.TEXT)
    description!: string;

    @CreatedAt
    createdAt!: string;

    @UpdatedAt
    updatedAt!: string;

    @BelongsToMany(() => DocType, () => DocTypeField)
    docTypes!: DocType[];
}