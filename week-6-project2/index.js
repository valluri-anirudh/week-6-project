const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
let user = [];
app.use(express.json());
const path = require('path');
const jwt_secret = 'your_jwt_secret_key';
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,"/public/index.html"));
});
//=================middleware=================
function auth(req,res,next){
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ msg: "token missing" });
        }

        const decoded = jwt.verify(token, jwt_secret);
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(401).json({ msg: "you are not logged in" });
    }
}
// ================== ME ==================
app.get('/me', auth,async (req, res) => {
    let founduser = null;
    for (let i = 0; i < user.length; i++) {
        if (user[i].username === req.user.username) {
            founduser = user[i];
            break;
        }
    }
    if (!founduser) {
        return res.json({ msg: "user not found" });
    }
    res.json({ username: founduser.username ,password: founduser.password});
});
// ================== SIGNUP ==================
app.post('/signup',async (req, res) => {
    const { username, password } = req.body;
    user.push({ username, password });
    res.json({
        msg: "user registered successfully"
    });
});
// ================== SIGNIN ==================
app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    let founduser = null;
    for (let i = 0; i < user.length; i++) {
        if (user[i].username === username && user[i].password === password) {
            founduser = user[i];
            break;
        }
    }
    if (!founduser) {
        return res.status(401).json({ msg: "invalid credentials" });
    }
    const token = jwt.sign({ username }, jwt_secret);
    res.json({token});
});
app.listen(3000, () => console.log('Server running on port 3000'));
