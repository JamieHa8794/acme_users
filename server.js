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
const faker = require('faker');
const { STRING , TEXT } = Sequelize;
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_users_db');

const User = db.define('user', {
    name:{
        type: STRING,
        allowNull: false
    },
    email: {
        type: STRING, 
        allowNull: false,
        validate:{
            isEmail: true
        }
    },
    bio: {
        type: TEXT
    }
});

User.beforeSave( user =>{
    if(!user.bio){
        user.bio = `${user.name}'s is a ${faker.name.jobType()} in the ${faker.name.jobArea()} field. ${faker.lorem.paragraphs(1)}`
    }
})


const syncAndSeed = async () =>{
    await db.sync({ force : true })
    await User.create({name: 'Moe', email: 'moe@gmail.com'})
    await User.create({name: 'Lucy', email: 'lucy@gmail.com'})
    await User.create({name: 'Larry', email: 'larry@yahoo.com'})
    await User.create({name: 'Curly', email: 'curly@hotmail.com'})

}


const init = async()=>{
    try{
        await db.authenticate();
        await syncAndSeed();
        //console.log(await  User.findAll())
    }
    catch(err){
        console.log(err)
    }
}

init();