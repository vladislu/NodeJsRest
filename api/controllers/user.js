const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

process.env.JWT_KEY = 'SecretKeyForJWT';

exports.register = async (req, res, next) => {
    const user = await User.findByEmail(req.body.email);
    console.log(user);
    if (user.length > 0) return res.status(409).json({ message: 'Email already exists.' });
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: err });
        } else {
            const registerUser = new User(req.body.firstName, req.body.lastName, req.body.email, hash, req.body.address, 'client');
            try {
                const result = registerUser.Create();
                return res.status(200).json({ message: 'User successfully registered.' });
            } catch (error) {
                return res.status(500).json({ error: err })
            }
        }
    });
}

exports.login = async (req, res, next) => {
    const user = new User();
    try {
        await user.LoadByEmail(req.body.email);
    } catch (error) {
        return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }
        if (result) {
            const token = jwt.sign(
                {
                    email: user.email,
                    userId: user.id,
                    role: user.role,
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
        else {
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }
    });
}

exports.update = async (req, res, next) => {
    const address = req.body.address;
    const user = new User();
    try {
        await user.LoadById(req.params.userId);
    } catch (error) {
        return res.status(500).json({ error: error });
    }

    user.address = address;

    try {
        await user.Save();
        res.status(200).json({ message: 'Address updated' });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}