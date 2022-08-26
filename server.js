const { db, syncAndSeed, models: {User} } = require('./db')
const express = require('express');
const app = express();
const path = require('path')

app.get('/styles.css', (req, res) => res.sendFile(path.join(__dirname,'styles.css')));

app.get('/', (req, res, next)=>{
    try{
        res.redirect('/users')
    }
    catch(err){
        next(err);
    }
})
app.get('/users', async (req, res, next)=>{
    try{
        const users = await User.findAll();
        res.send(`
            <html>
            <head>
            <link rel='stylesheet' href='/styles.css'/>
            </head>
            <body>
                <h1>
                Users ${users.length}
                </h1>
                <ul>
                ${users.map(user =>{
                    return(`
                    <li>
                    <div>
                    email: ${user.email}
                    </div>
                    <div>
                    bio: ${user.bio}
                    </div>
                    </li>
                    `)
                }).join('')}
                </ul>
            </body>
            </html>
        
        
        `);
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