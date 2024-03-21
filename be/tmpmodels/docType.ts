import { BelongsTo, BelongsToMany, Column, CreatedAt, DataType, ForeignKey, HasMany, Model, Table, UpdatedAt } from 'sequelize-typescript'
import { Field } from './field';
import { User } from './user';
import { DocTypeField } from './docTypeField';

@Table
export class DocType extends Model {

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, primaryKey: true})
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

