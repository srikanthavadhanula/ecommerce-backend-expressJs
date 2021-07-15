const express = require('express');
const { signup, signin, isAuthenticated } = require('../controllers/auth');
const router = express.Router();



router.post("/signup" , signup);

router.post("/signin" , signin);

router.post("/profile", isAuthenticated , (req, res) => {
    res.status(200).json({
        message: "profile"
    })
})

module.exports = router;