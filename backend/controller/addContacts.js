import UserModel from "../models/user";

const addContact = async (req, res) => {
    const { username } = req.params;
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User Does Not Exist",
            });
        }

        const userToAdd = await UserModel.findOne({ username }); 

        if (!userToAdd) {
            return res.status(404).json({
                message: "User Does Not Exist",
            });
        }

        const isAlreadyContact = await user.contacts.some((contact) => contact.username === userToAdd.username);

        if (isAlreadyContact) {
            return res.status(404).json({
                message: "User Exist in Your Contacts",
            });
        };

        const formattedDate = new Date().toLocaleDateString('en-GB');


        await user.contacts.push({
            userId :userToAdd._id,
            username:  userToAdd.username, 
            firstName: userToAdd.firstName,
            lastName: userToAdd.lastName,
            time : formattedDate,
        });
        await userToAdd.contacts.push({
            userId :user._id,
            username:  user.username, 
            firstName: user.firstName,
            lastName: user.lastName,
            time : formattedDate,
        });

        await user.save();
        await userToAdd.save();

        res.status(200).json({
            message : 'Contact added successfully', 
        });


    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
        });
        console.log("ADD Contact Error" + error);
    }

}

export default addContact;