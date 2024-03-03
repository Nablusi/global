import UserModel from "../models/user";
import bcrypt from 'bcryptjs';
import ProfileModel from '../models/profile';

export const registerController = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const userProfile = new ProfileModel({
            about: '',
            image: Buffer.from(''),
        })

        await userProfile.save();


        try {
            const isUserNameExist = await UserModel.findOne({ username });
            const isEmailExist = await UserModel.findOne({ email });

            if (isUserNameExist && isEmailExist) {
                return res.status(409).json({
                    message: 'Username and email are already in use'
                });
            } else if (isUserNameExist) {
                return res.status(409).json({
                    message: 'Username is already exist'
                });
            } else if (isEmailExist) {
                return res.status(409).json({
                    message: 'Email is already exist'
                });
            }


            const createUser = await UserModel.create({
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                password: hashedPassword,
                profile: userProfile._id
            });

            await createUser.save();

            res.status(200).json({
                message: 'Account has been created successfully',
            });
        } catch (validationError) {

            const validationErrors = {};
            for (const key in validationError.errors) {
                if (validationError.errors.hasOwnProperty(key)) {
                    validationErrors[key] = validationError.errors[key].message;
                }
            }

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        }

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};
