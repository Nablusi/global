export const validate = (req, res, next) => {
    const { firstName, lastName, username, email, password } = req.body;

    try {
        if (!firstName || !lastName || !username || !email || !password) {
            return res.status(400).json({ error: 'Validation failed: All fields are required' });
        }

        if (firstName.trim() === '') {
            return res.status(400).json({ error: 'Validation failed: First name cannot be empty' });
        }

        if (lastName.trim() === '') {
            return res.status(400).json({ error: 'Validation failed: Last name cannot be empty' });
        }

        if (username.trim() === '') {
            return res.status(400).json({ error: 'Validation failed: Username cannot be empty' });
        }

        if (email.trim() === '') {
            return res.status(400).json({ error: 'Validation failed: Email cannot be empty' });
        }

        if (password.trim() === '') {
            return res.status(400).json({ error: 'Validation failed: Password cannot be empty' });
        }

        next();

    } catch (error) {
        console.error('Validation Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const validateLogin = (req,res, next)=>{
    const {email, password } = req.body; 
    try{
        if (email.trim() === '') {
            return res.status(400).json({ error: 'Validation failed: Email cannot be empty' });
        }

        if (password.trim() === '') {
            return res.status(400).json({ error: 'Validation failed: Password cannot be empty' });
        }

        next();

    }catch(error){
        console.error('Validation Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}
