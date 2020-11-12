const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models').Users;

const signup = (req,res) => {
    bcrypt.genSalt(10, (err, salt) => {
        if(err){
            return res.status(500).json(err);
        }

        bcrypt.hash(req.body.password, salt, (err, hashedPwd) => {
            if (err){
                return res.status(500).json(err);
            }
            req.body.password = hashedPwd;
            console.log(req.body)
            User.create(req.body)
            .then(newUser => {
                const token = jwt.sign(
                    {
                        username: newUser.username,
                        id: newUser.id
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "30 days"
                    }
                )
                newUser.dataValues.token = token;
                delete newUser.dataValues.password;
                console.log(newUser)
                res.send(newUser);
            })
            .catch(err => {
                console.log(err)
                if(err.name === 'SequelizeUniqueConstraintError'){
                    res.status(400).send(`Error: ${err.name}`)
                }
                else{
                    res.status(400).send(`Error: ${err}`);
                }
            })
        })
    })
}

const login = (req,res) => {
    User.findOne({
        where: {
            username: req.body.username
        },
        attributes: ['name','childId','id','username','password']
    })
    .then(foundUser => {
        if(foundUser){
            bcrypt.compare(req.body.password, foundUser.password, (err,match) => {
                if(match){
                    const token = jwt.sign(
                        {
                            id: foundUser.id,
                            username: foundUser.username
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "30 days"
                        }
                    )
                    foundUser.dataValues.token = token;
                    delete foundUser.dataValues.password;
                    res.send(foundUser);
                } else{
                    res.send(`Incorrect Password`)
                }
            })
        }
        else if(!foundUser){
            return res.send(`Incorrect Username`)
        }
    })
    .catch(err => {
        res.status(400).send(`Error: ${err}`);
    }
    )
}

const verifyUser = (req, res) => {
    User.findByPk(req.user.id, {
        attributes: ['id', 'username','name','childId']
    })
    .then(foundUser => {
        res.status(200).json(foundUser);
    })
    .catch(err => {
        res.status(500).send(`Error: ${err}`);
    })
}

module.exports = {
    signup,
    login,
    verifyUser
}