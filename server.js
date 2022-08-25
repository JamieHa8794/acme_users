/*
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

*/

const Sequelize = require('sequelize');
const { STRING } = Sequelize;
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_users_db');

const User = db.define('user', {
    email: {
        type: STRING, 
        allowNull: false
    }
});


const syncAndSeed = async () =>{
    await db.sync({ force : true })
    await User.create({email: 'moe@gmail.com'})
}


const init = async()=>{
    await db.authenticate();
    await syncAndSeed();
    console.log(await  User.findAll())
}

init();