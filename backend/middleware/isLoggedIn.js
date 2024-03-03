import jwt from 'jsonwebtoken';
import UserModel from '../models/user';

const isLoggedIn = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized: No token provided',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized: User not found',
            });
        }

        req.user = user;

        next();
        
    } catch (error) {
        console.error('Authentication Error:', error);
        return res.status(401).json({
            message: 'Unauthorized: Invalid token',
        });
    }
};

export default isLoggedIn;
