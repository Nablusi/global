import UserModel from "../models/user";

const userProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).json({
                message: 'user does not exist',
            });
        }
        const userWithProfile = await UserModel.findOne({ username }).populate("profile"); 

        if (!userWithProfile) {
            return res.status(404).json({
                message: 'User profile not found',
            });
        }

        return res.status(200).json({
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profile: userWithProfile.profile,
        });



    } catch (error) {
        res.status(500).json({
            message: 'Interanl Server Error',
        });
        console.log('Profile Error' + error);
    };
}

export default userProfile; 