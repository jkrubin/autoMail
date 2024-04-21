import { AfterFind, BeforeCreate, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Model, Table, UpdatedAt } from "sequelize-typescript";
import { User } from "./user";
import { DocType } from "./docType";

@Table
export class Extraction extends Model {

    @Column(DataType.TEXT)
    text!: string;

    @Column(DataType.TEXT)
    extractedJSON!: string

    @CreatedAt
    createdAt!: string;

    @UpdatedAt
    updatedAt!: string;

    @BeforeCreate
    @BeforeUpdate
    static createSnakeCaseName(extraction: Extraction){
        if(extraction.changed('extractedJSON')){
            const extractedJSON = extraction.get('extractedJSON')
            extraction.extractedJSON = JSON.stringify(extractedJSON)
        }
    }

    @AfterFind
    static parseJSON(extraction: Extraction){
        extraction.extractedJSON = JSON.parse(extraction.extractedJSON)
    }
    @BelongsTo(() => User)
    user!: User;
    
    @BelongsTo(() => DocType)
    docType!: DocType;
  
}