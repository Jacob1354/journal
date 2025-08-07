import { Client, Pool } from 'pg'
import { DB , PASSWORD, USER } from './const.js'
import { Day } from '../js/data/day.js';

export function load_db_pool() {
    const pool = new Pool({
        user: USER,
        password: PASSWORD,
        database: DB
    });
    return pool;
}

export async function get_client_from_pool(pool) {
    return await pool.connect()
        .catch((err) => {
            console.log("Couldn't connect to the db\n" + err);
        });
}

export async function load_day(date = new Date()) {
    const pool = load_db_pool();
    const client = await get_client_from_pool(pool);
    const result = await client.query();
    console.log(result);
    return new Day();
}
