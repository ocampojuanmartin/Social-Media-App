const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")


//REGISTER
router.post("/register", async (req,res)=>{
    const {username, email, password} = req.body
    
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save()
        res.status(200).json(user)
    } catch(err){
        res.status(500).json(err)
    }
})

//LOGIN
router.post("/login", async (req,res) =>{
   
    try{
        const user = await User.findOne({email: req.body.email})
        !user && res.status(404).json("User not found")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("Wrong password")
        
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }

   
})

module.exports = router