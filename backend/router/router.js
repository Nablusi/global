const router = require('express').Router();
import { validate } from "../middleware/validate";
import { validateLogin } from "../middleware/validate";
import { registerController } from '../controller/register';
import { login } from '../controller/login';
import isLoggedIn from "../middleware/isLoggedIn";
import userProfile from "../controller/profile";
import getContacts from "../controller/contacts";
import addContact from "../controller/addContacts";
import removeContacts from "../controller/removeContact";
import { getMessages } from "../controller/messages";
import { addMessage } from "../controller/messages";

router.post('/signup', validate, registerController);
router.post('/login', validateLogin, login);
router.get('/home', isLoggedIn, (req, res) => {
    res.status(200).json({
        message: 'welcome'
    })
});


router.get('/users/:username/profile', isLoggedIn, userProfile);
router.get('/home/contacts/:username', isLoggedIn, getContacts);
router.post('/users/:username/profile/add', isLoggedIn, addContact);
router.post('/users/:username/profile/remove', isLoggedIn, removeContacts);
router.get('/messages/:room', isLoggedIn, getMessages);
router.post('/messages/:room/chat', isLoggedIn,addMessage); 



export default router; 