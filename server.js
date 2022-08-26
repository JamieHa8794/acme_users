const { db, syncAndSeed, models: {User} } = require('./db')
const express = require('express');
const app = express();


app.get('/', async (req, res, next)=>{
    try{
        const users = await User.findAll();
        res.send(users);
    }
    catch(err){
        next(err);
    }
})



const init = async()=>{
    try{
        await db.authenticate();
        await syncAndSeed();
        const port = process.env.PORT || 3000;
        app.listen(port, ()=> console.log(`listening on port ${port}`));
    }
    catch(err){
        console.log(err)
    }
}

init();