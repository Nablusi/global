import React, { useState } from "react";
import { TextField, Box, IconButton, Button, FormControl, Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import instance from "../config/axios";
import { API_REGISTER } from "../config/url";
import { toast } from "react-toastify";

export default function SignUp(props) {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUserName] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [email, setEmail] = useState(''); 
    const [firstName, setFirstName] = useState(''); 
    const [lastName, setLastName] = useState(''); 

    function clickShowPasswordHandler() {
        setShowPassword(!showPassword);
    }

    function clickSubmitHandler() {
        props.setChangeColor(!props.changeColor);
    }
    function changeFirstNameHandler(e){
        setFirstName(e.target.value); 
    }
    function changeLastNameHandler(e){
        setLastName(e.target.value); 
    }
    function changeLUserNameHandler(e){
        setUserName(e.target.value); 
    }
    function changePasswordHandler(e){
        setPassword(e.target.value); 
    }
    function changeEmailHandler(e){
        setEmail(e.target.value); 
    }

    const submitHandler = async(e) =>{
        e.preventDefault(); 
        try{
            const response = await instance.post(API_REGISTER, {
                username, 
                password, 
                email, 
                firstName, 
                lastName, 
            }); 
            console.log(response.data); 
            toast.success('your account has been created successfuly, please Login', { position:'top-center'}); 
        } catch(error){
            if (error.response) {
                const status = error.response.status;
                if (status === 404) {
                    toast.warning('Either email or password is incorrect', {
                        position: 'top-center'
                    });
                } else if (status === 400) {
                    toast.warning('Please fill all the fields', {
                        position: 'top-center'
                    });
                }else if (status === 409) {
                    toast.warning(error.response.data.message, {
                        position: 'top-center'
                    });
                }
                else {
                    console.log('Unexpected error status:', status);
                }
            } else if (error.request) {
                console.log('No response received:', error.request);
            } else {
                console.log('Request setup error:', error.message);
            }
        }
    }



    return (
        !props.changeColor ?
            <Box component={"div"}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: '20px',
                    width: '100%',
                    height: '100%',
                    color: '#ffffff',
                    padding: '20px',
                    borderTopLeftRadius: '120px',
                    borderBottomLeftRadius: '120px',

                }}
            >
                <Typography component={'h2'} variant="h6" sx={{ fontSize: '25px', fontWeight: 'bold' }} >Welcome Chatter</Typography>
                <Typography component={'p'} sx={{ fontSize: '14px', textAlign: 'center' }} >
                    You dont have an account? Register with your Personal Details to Start chatting
                </Typography>
                <Button sx={{ color: '#ffffff' }} onClick={clickSubmitHandler}> Sign up </Button>


            </Box>
            :
            <FormControl component={'form'}
                onSubmit={submitHandler}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: '20px',
                    width: '100%',
                    height: '100%',
                }}

            >

                <Typography component={'p'}> Sign Up </Typography>
                <Box component={'div'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: '20px', ml: '20px', mr: '20px' }} >
                    <TextField label='First Name' onChange={changeFirstNameHandler}  />
                    <TextField label='Last Name'  onChange={changeLastNameHandler}/>
                </Box>
                <TextField variant="outlined" label='Email' sx={{ width: '90%' }}  onChange={changeEmailHandler}/>
                <TextField variant="outlined" label='username' sx={{ width: '90%' }}  onChange={changeLUserNameHandler} />
                <Box component={'div'}
                    sx={{
                        position: 'relative',
                        width:'90%',

                    }}
                >
                    <TextField  sx={{width:'100%'}} variant="outlined"   label='Password' type={showPassword ? 'text' : 'password'}  onChange={changePasswordHandler} />
                    <IconButton sx={{ position: 'absolute', top: '8px', right: '4px' }} onClick={clickShowPasswordHandler}  > {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />} </IconButton>
                </Box>

                <Button type="submit" >Register</Button>
            </FormControl>
    )
}
