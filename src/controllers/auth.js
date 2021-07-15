const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    User.findOne({ email:req.body.email })
    .exec((error , user) => {
        if(user) {
            return res.status(400).json({
                message: "User already registered"
            });
        }

        const {firstName, lastName, email, password} = req.body;

        const _user = new User({
            firstName,
            lastName,
            email,
            password,
            userName: Math.random().toString()
        });

        _user.save((error, data) => {
            if(error) {
                return res.status(401).json({
                    message: "Unable to register"
                });
            }

            if(data) {
                return res.status(200).json({
                    message: "User got registered"
                })
            }

        })
    });
}

exports.signin = (req, res) => {
    User.findOne({email: req.body.email})
    .exec((error, user) => {
        if(error) return res.status(400).json({message: "Internal Error"});
        if(user) {
            if(user.authenticate(req.body.password)){
                const token = jwt.sign({_id: user._id}, process.env.JWT_HASH, { expiresIn: '1h' });
                const { _id, firstName, lastName, email, role, fullName } = user;
                return res.status(200).json({
                    token,
                    user : {
                        _id, firstName, lastName, email, role, fullName
                    }
                })
            }else {
                return res.status(400).json({message: "wrong credentails"});
            }
        }else {
            return res.status(400).json({message: "User Doesnot Exits"})
        }
    })
}

exports.isAuthenticated = (req, res, next) => {
    const token = req.headers.authentication.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_HASH);
    req.user = user;
    next();
}