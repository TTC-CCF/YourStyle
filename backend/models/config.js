import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config({ path: '../secret/.env' });

const sequelize_pool = new Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
        pool: {
            max: 10,
            min: 2,
            idle: 10000
        },
    }
);

export default sequelize_pool;