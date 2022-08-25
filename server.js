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