const authController = require('express').Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

//register the new user details
authController.post('/register', async (req, res) => {
    try {
        const isExisting = await User.findOne({email: req.body.email})
        if(isExisting){
            throw new Error("Already such an account. Try a different email")
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = await User.create({...req.body, password: hashedPassword})

        const {password, ...others} = newUser._doc
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '5h'})

        return res.status(201).json({user: others, token})
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

//validate and login the user
authController.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({ error: "User does not exist. Please sign up." });
      }
      const comparePass = await bcrypt.compare(req.body.password, user.password);
      if (!comparePass) {
        throw new Error("Invalid credentials");
      }
  
      const { password, ...others } = user._doc;
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
      return res.status(200).json({ user: others, token });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });



module.exports = authController