import { AfterFind, BeforeCreate, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from "sequelize-typescript";
import { User } from "./user";
import { DocType } from "./docType";

@Table
export class Extraction extends Model {

    @ForeignKey(() => User)
    @Column
    userId!: number;

    @Column(DataType.TEXT)
    text!: string;

    @Column(DataType.TEXT)
    extractedJSON!: any

    @CreatedAt
    createdAt!: string;

    @UpdatedAt
    updatedAt!: string;

    // @AfterFind
    // static parseJSON(extraction: Extraction | Extraction[]){
    //     if(extraction.constructor === Array){
    //         for(let i=0; i < extraction.length; i++){
    //             extraction[i].extractedJSON = JSON.parse(extraction[i].extractedJSON)
    //         }
    //     }else{
    //         (extraction as Extraction).extractedJSON = JSON.parse((extraction as Extraction).extractedJSON)
    //     }
    // }
    @BelongsTo(() => User)
    user!: User;
  
}