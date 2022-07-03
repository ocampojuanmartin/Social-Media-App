const router = require("express").Router()
const User = require("../models/User")


//REGISTER
router.get("/register", async (req,res)=>{
    res.send("ok")
})

module.exports = router