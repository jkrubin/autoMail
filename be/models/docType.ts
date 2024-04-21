import { AllowNull, BeforeCreate, BeforeUpdate, BelongsTo, BelongsToMany, Column, CreatedAt, DataType, ForeignKey, HasMany, Model, Table, UpdatedAt } from "sequelize-typescript";
import { User } from "./user";
import { Field } from "./field";

@Table
export class DocType extends Model {

    @ForeignKey(() => User)
    @Column
    userId!: number;

    @Column
    name!: string;

    @Column
    snakeName!: string;

    @Column(DataType.TEXT)
    description!: string

    @CreatedAt
    createdAt!: string;

    @UpdatedAt
    updatedAt!: string;

    @BeforeCreate
    @BeforeUpdate
    static createSnakeCaseName(docType: DocType){
        if(docType.changed('name')){
            const snakeName = docType.get('name').replace(/\s+/g, '_')
            .replace(/[^\w\s]/g, '')
            .toLowerCase()
            docType.snakeName = snakeName
        }
    }

    @BelongsTo(() => User)
    user!: User;

    @BelongsToMany(() => Field, () => DocTypeField)
    fields!: Field[];
}

@Table
export class DocTypeField extends Model {
    @ForeignKey(() => DocType)
    @AllowNull(false)
    @Column
    docTypeId!: number;

    @ForeignKey(() => Field)
    @AllowNull(false)
    @Column
    fieldId!: number;
}

