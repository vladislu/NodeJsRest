const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

process.env.JWT_KEY = 'SecretKeyForJWT';

exports.register =  (req, res, next) => {
    User.findOne({where : {email : req.body.email}})
    .then(user => {
        if(user){
            return res.status(409).json({message: 'Email already exists.'});
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({ error: err});
                }else{
                    User.create({
                        first_name: req.body.firstName,
                        last_name: req.body.lastName,
                        email: req.body.email,
                        password: hash,
                        address: req.body.address,
                        role: 'client'
                    })
                    .then(result => {
                        res.status(200).json({message: 'User successfully registered.'});
                    })
                    .catch(err => res.status(500).json({ error: err}));
                }
            });
        }
    })
    .catch(err => res.status(500).json({error: err}));
}

exports.login = (req, res, next) => {
    User.findAll({where : {email : req.body.email}})
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({message: 'Incorrect email or password.'});
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                return res.status(401).json({message: 'Incorrect email or password.'});
            }
            if(result){
                const token = jwt.sign(
                 {
                    email: user[0].email,
                    userId: user[0].id,
                    role: user[0].role,
                 },
                 process.env.JWT_KEY,
                 {
                     expiresIn: "10h"
                 });
                return res.status(200).json({
                    message: 'Login successful.',
                    token: token
                });
            }
            else{
                return res.status(401).json({message: 'Incorrect email or password.'});
            }
        });
    })
    .catch(err => res.status(500).json({error: err}));
}

exports.update =  (req, res, next) =>{
    const address = req.body.address;
    User.findByPk(req.params.userId)
        .then(user => {
            user.address = address;
            return user.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Address updated'});
        })
        .catch(err => { res.status(500).json({error: err})});
}