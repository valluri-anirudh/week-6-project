const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
let user = [];
app.use(express.json());
const jwt_secret = 'your_jwt_secret_key';
// ================== ME ==================
app.get('/me', async (req, res) => {
    try {
        const decodingthetoken = jwt.verify(
            req.headers.authorization,
            jwt_secret
        );
        let founduser = null;
        for (let i = 0; i < user.length; i++) {
            if (user[i].username === decodingthetoken.username) {
                founduser = user[i];
                break;
            }
        }
        if (!founduser) {
            return res.json({ msg: "user not found" });
        }
        res.json({ username: founduser.username });
    } catch (err) {
        res.status(401).json({ msg: "invalid or missing token" });
    }
});
// ================== SIGNUP ==================
app.post('/signup', async (req, res) => {
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
    res.json({ token });
});
app.listen(3000, () => console.log('Server running on port 3000'));
