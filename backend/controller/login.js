require('dotenv').config(); 
import UserModel from "../models/user";
import bcrybt from 'bcryptjs';
import JWT from 'jsonwebtoken'; 


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(404).json({
                message: 'email or password is incorrect' , 
            }); 
        }; 

       const isPasswordMatches = await bcrybt.compare(password, user.password); 

       if(!isPasswordMatches){ 
        return res.status(404).json({
            message: 'email or password is incorrect' , 
        }); 
       }

       const token = await JWT.sign({userId : user._id, email:user.email}, process.env.JWT_SECRET, { expiresIn: '1h' }); 

       
       res.status(200).json({
        JWT: token, 
        email : user.email, 
        username: user.username, 
        firstName: user.firstName,
        lastName: user.lastName, 
        userId: user._id, 
       })



    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
        });
        console.log('Login Error' + error);

    };
}