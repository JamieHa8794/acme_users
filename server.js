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
                Users List (${users.length})
                </h1>
                <div class='form-users'>
                    <form method='POST'>
                        <input name='name' placeHolder='Enter Name'/>
                        <input name='email' placeHolder='Enter Email'/>
                        <textarea name='bio' placeHolder='Enter Bio'></textarea>
                        <button>Create</button>
                    </form>
                    <div class='vr'></div>
                    <div class='Title-UserList'>
                        <div>
                            Click to see more about:
                        </div>
                        <ul>
                        ${users.map(user =>{
                            return(`
                            <li>
                            <a href='/users/${user.id}'>${user.name}</a>
                            <form method='POST' action='/users/${user.id}?_method=DELETE'>
                            <button>x</button>
                            </form>
                            </li>
                            `)
                        }).join('')}
                        </ul>
                    </div>
                </div>
            </body>
            </html>
        
        
        `);
    }
    catch(err){
        next(err);
    }
})

app.post('/users', async (req, res, next)=>{
    try{
        const user = await User.create({
            name: req.body.name,
            email: req.body.email
        });
        res.redirect(`/users/${user.id}`)
    }
    catch(err){
        next(err);
    }
})

app.delete('/users/:id', async (req, res, next)=>{
    try{
        const user = await User.findByPk(req.params.id);
        await user.destroy();
        res.redirect('/users')
    }
    catch(err){
        next(err);
    }
})

app.get('/users/:id', async (req, res, next)=>{
    try{
        const user = await User.findByPk(req.params.id)
        res.send(`
            <html>
                <head>
                    <link rel='stylesheet' href='/styles.css'>
                    <title>Users/${user.name}</title>
                </head>
                <body>
                    <h1>
                        ${user.name}
                        <a href='/users'>Go back to all</a>
                    </h1>
                    
                    <div>
                    email: ${user.email}
                    </div>
                    <div>
                    bio: ${user.bio}
                    </div>
                </body>
            </html>
        `)
    }
    catch(err){
        next(err);
    }
})



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