import React, { useState } from "react";
import { TextField, Box, IconButton, Button, FormControl, Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import instance from "../config/axios";
import { API_SIGNIN } from "../config/url";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'


export default function SignIn(props) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 

    function clickShowPasswordHandler() {
        setShowPassword(!showPassword);
    }

    function clickSubmitHandler() {
        props.setChangeColor(!props.changeColor);
    }


    function changePasswordHandler(e) {
        setPassword(e.target.value);

    }

    function changeEmailHandler(e) {
        setEmail(e.target.value);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await instance.post(API_SIGNIN, { email, password });



            if (response.status === 404) {
                toast.warning('Either eamil or password incorrect', {
                    position: 'top-center'
                })
            }
            if (response.status === 400) {
                toast.warning('Please fill all the Fileds', {
                    position: 'top-center'
                })
            }

            if (response.status === 200) {
                localStorage.setItem('user', JSON.stringify( response.data ));
                navigate(`/home/${response.data.username}`); 
            }

        } catch (error) {
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
                } else {
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
        props.changeColor ?
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
                <Typography component={'h2'} variant="h6" sx={{ fontSize: '25px', fontWeight: 'bold' }} >Welcome Back</Typography>
                <Typography component={'p'} sx={{ fontSize: '14px', textAlign: 'center' }} >
                    You  have an account? Login with your Personal Details to Start chatting
                </Typography>
                <Button sx={{ color: '#ffffff' }} onClick={clickSubmitHandler}> Sign In </Button>


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
                <Typography component={'p'}>Sign In </Typography>
                <TextField variant="outlined" label='Email' onChange={changeEmailHandler} />
                <Box component={'div'}
                    sx={{
                        position: 'relative'
                    }}
                >
                    <TextField variant="outlined" label='Password' type={showPassword ? 'text' : 'password'} onChange={changePasswordHandler} />
                    <IconButton sx={{ position: 'absolute', top: '8px', right: '4px' }} onClick={clickShowPasswordHandler} > {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />} </IconButton>
                </Box>

                <Button type="submit">Login</Button>
            </FormControl>

    )
}