import UserModel from "../models/user";

const getContacts = async(req,res) =>{
    const { username }  = req.params; 
    try{
        const user = await UserModel.findOne({ username }); 

        if(!user){
            return res.status(404).json({
                message: 'User Does Not Exist'
            }); 
        }

        res.status(200).json({
            contacts : user.contacts, 
        })


    } catch(error){
        res.status(500).json({
            message: 'Internal Server Error', 
        }); 
        console.log('Get Contacts Error' + e); 
    }
}

export default getContacts; 