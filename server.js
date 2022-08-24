const { Client } = require('pg');
const client = new Client(process.env.DATABASE_URL || 'postgress://localhost/acme_users_db');

const syncAndSeed = async ()=>{
    const SQL = `
        DROP TABLE IF EXISTS users;
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            email VARCHAR(20) NOT NULL UNIQUE
        );
    `
    await client.query(SQL)
}

const getUsers = async ()=>{
    return(
        await client.query(
            'SELECT * FROM users'
        )
    ).rows;
}

const createUser = async({ email })=>{
    return( await client.query(
        'INSERT INTO users(email) VALUES($1) RETURNING *', [email]
    )
    ).rows[0];
}

const init = async () =>{
    try{
        await client.connect();
        console.log('connected to database')
        await syncAndSeed();
        const user = await createUser({email: 'moe@gmail.com'})
        console.log(await getUsers())
    }
    catch(err){
        console.log(err)
    }
}

init();