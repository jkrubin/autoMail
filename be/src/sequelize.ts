import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { Permission, User, UserPermission } from "../models/user";
import { DocType, DocTypeField } from "../models/docType";
import { Field } from "../models/field";
import { Extraction } from "../models/extraction";
import dotenv from 'dotenv'
dotenv.config()
const env = process.env.NODE_ENV || 'development';
// - DB_HOST=db
// - DB_USER=mail
// - DB_PASS=admin
// - DB_NAME=automail
const config: SequelizeOptions = {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASS || "admin",
    "database": process.env.DB_NAME || "automail",
    "host": process.env.DB_HOST || "127.0.0.1",
    "dialect": "mysql"
}

const models = [
  User,
  Permission,
  UserPermission,
  DocType,
  Field,
  DocTypeField,
  Extraction
]

const sequelize = new Sequelize({
    ...config,
})

sequelize.addModels(models)

export { sequelize }