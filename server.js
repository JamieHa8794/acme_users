const { db, syncAndSeed, models: {User} } = require('./db')
const express = require('express');
const app = express();
const path = require('path')

app.get('/styles.css', (req, res) => res.sendFile(path.join(__dirname,'styles.css')));

app.use(express.urlencoded({exteded: false}))
app.use(require('method-override')('_method'))

app.get('/', (req, res, next)=>{
    try{
        res.redirect('/users')
    }
    catch(err){
        next(err);
    }
})

app.use('/users', require('./routes/users'))

const init = async()=>{
    try{
        await db.authenticate();
        if(process.env.SYNC){
            await syncAndSeed();
        }
        const port = process.env.PORT || 3000;
        app.listen(port, ()=> console.log(`listening on port ${port}`));
    }
    catch(err){
        console.log(err)
    }
}

init();