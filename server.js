const { db, syncAndSeed, models: {User} } = require('./db')



const init = async()=>{
    try{
        await db.authenticate();
        await syncAndSeed();
        console.log(await  User.findAll())
    }
    catch(err){
        console.log(err)
    }
}

init();