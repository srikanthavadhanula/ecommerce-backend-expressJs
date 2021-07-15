const User = require('../../models/User');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    User.findOne({ email:req.body.email })
    .exec((error , user) => {
        if(user) {
            return res.status(400).json({
                message: "Admin already registered"
            });
        }

        const {firstName, lastName, email, password} = req.body;

        const _user = new User({
            firstName,
            lastName,
            email,
            password,
            userName: Math.random().toString(),
            role: "admin"
        });

        _user.save((error, data) => {
            if(error) {
                return res.status(401).json({
                    message: "Unable to register"
                });
            }

            if(data) {
                return res.status(200).json({
                    message: "Admin got registered"
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
            if(user.authenticate(req.body.password) && user.role === "admin"){
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
            return res.status(400).json({message: "Admin Doesnot Exits"})
        }
    })
}

exports.isAuthenticated = (req, res, next) => {
    const token = req.headers.authentication.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_HASH);
    req.user = user;
    next();
}