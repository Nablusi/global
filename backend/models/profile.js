import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    about: {
        type: String,
        maxlength: 500, 
        trim: true,    
    },
    image: {
        type: Buffer,
    },
});


const ProfileModel = mongoose.model("Profile", profileSchema); 

export default ProfileModel; 