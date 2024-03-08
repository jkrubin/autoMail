import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { User } from "../models/user";
const env = process.env.NODE_ENV || 'development';

const config: Record<string, SequelizeOptions> = {
    development: {
      "username": "root",
      "password": "admin",
      "database": "automail",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    test: {
      "username": "root",
      "password": "admin",
      "database": "database_test",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    production: {
      "username": "root",
      "password": "admin",
      "database": "database_production",
      "host": "127.0.0.1",
      "dialect": "mysql"
    }
  }

  
export const sequelize = new Sequelize({
    ...config[env],
    models: [User]
})