const router = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")

// UPDATE
router.put("/:id", async (req, res) => {
    if(req.body.userId === req.params.id  || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch(err){
                return res.status(500).json(err)
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            })
            res.status(200).json("Account has been updated")
        } catch(err){
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can only edit your user!")
    }
})

// DELETE
router.delete("/:id", async (req, res) => {
    if(req.body.userId === req.params.id  || req.body.isAdmin){
        try{
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted")
        } catch(err){
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can only delete your user!")
    }
})

// GET ONE
router.get("/:id", async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        const {password, ...other} = user._doc // user._doc has all user properties and from that doc i'm telling the res not to return the user password.
        res.status(200).json(other)
    }catch(err){
        res.status(500).json(err)
    }
})

// FOLLOW
router.put("/follow/:id", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const userToFollow = await User.findById(req.params.id) // the user that i put in params is the user i want to follow
            const user = await User.findById(req.body.userId) // i put my user ID in body
            if (!userToFollow.followers.includes(req.body.userId)){
                await user.updateOne({ $push: {following: req.params.id} })// i push the users i want to follow into the array "following" (user property)
                await userToFollow.updateOne( { $push: {followers: req.body.userId} }) // i also push my user into the other user's followers.
                
                res.status(200).json("you are now following this user")        
            } else {
                return res.status(403).json("You already follow that user")
            }
        } catch(err){
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can't follow yourself!")
    }
})

// UNFOLLOW
router.put("/unfollow/:id", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const userToUnfollow = await User.findById(req.params.id) // the user that i put in params is the user i want to unfollow
            const user = await User.findById(req.body.userId) // i put my user ID in body
            if (userToUnfollow.followers.includes(req.body.userId)){
                await user.updateOne({ $pull: {following: req.params.id} })// i push the users i want to follow into the array "following" (user property)
                await userToUnfollow.updateOne( { $pull: {followers: req.body.userId} }) // i also push my user into the other user's followers.
                
                res.status(200).json("you are no longer following this user")        
            } else {
                return res.status(403).json("You do not follow that user")
            }
        } catch(err){
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can't unfollow yourself!")
    }
})


module.exports = router


