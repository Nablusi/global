import UserModel from "../models/user";

const removeContacts = async (req, res) => {
    const { username } = req.params;
    const { email } = req.body;
    try {
        const requestingUser = await UserModel.findOne({ email });
        if (!requestingUser) {
            return res.status(404).json({
                message: "email does not exist",
            });
        }

        const userToRemove = await UserModel.findOne({ username }); 

        if (!userToRemove) {
            return res.status(404).json({
                message: "user does not exist",
            });
        }

        const isUserToRemoveExistingInContacts = requestingUser.contacts.some((contact) => {
            return contact.username === userToRemove.username; 
        }); 

        if (!isUserToRemoveExistingInContacts){ 
            return res.status(400).json({
                message: "User does not exist in contacts",
            });
        }

        requestingUser.contacts =  requestingUser.contacts.filter((contact)=>{
            return contact.username !== userToRemove.username; 
        }); 
        userToRemove.contacts = userToRemove.contacts.filter((contact)=>{
            return contact.username !== requestingUser.username; 
        }); 

        await requestingUser.save(); 
        await userToRemove.save(); 


        res.status(200).json({
            message: "User removed Successfuly", 
        }); 


    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
        });

        console.log("Remove Contact Error " + error);
    }
}

export default removeContacts; 