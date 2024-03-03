import React, { useEffect, useState } from "react";
import { Avatar, Box, Typography, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import instance from "../config/axios";


export default function Profile() {
    const params = useParams();
    const user = JSON.parse(localStorage.getItem('user'));
    const username = user.username;
    const token = user.JWT;
    const [userInfo, settUserInfo] = useState({});
    const [checkContact, setCheckContact] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const email = user.email; 

    const getUserProfile = async () => {
        const response = await instance.get(`/users/${params.username}/profile`, {
            headers: {
                Authorization: token,
            }
        });
        settUserInfo(response.data);
    };
    
    const getContacts = async () => {
        const response = await instance(`/home/contacts/${username}`, {
            headers: {
                Authorization: token,
            }
        });
        setCheckContact(response.data);
    }

    async function removeHandler() {
        const response = await instance.post(`/users/${params.username}/profile/remove`, { email }, {
            headers: {
                Authorization: token
            }
        });
        setRefresh((prevRefresh) => !prevRefresh);
    }
    
    async function addHandler() {
        const response = await instance.post(`/users/${params.username}/profile/add`, { email }, {
            headers: {
                Authorization: token
            }
        });
        setRefresh((prevRefresh) => !prevRefresh);
    }




        
    const isContactExist = () => {
        return checkContact.contacts && checkContact.contacts.some((contact) => contact.username === params.username);

    }


    useEffect(() => {
        getUserProfile();
        getContacts();
    }, [refresh]);


    return (
        <Box component={'div'} sx={{ position: 'relative' }} >
            <Box component={'div'} sx={{ width: "100%", height: '180px', backgroundColor: '#CDD8FE' }}></Box>
            <Avatar sx={{ position: 'absolute', width: '120px', height: '120px', top: '121px', left: '50px', fontSize: '30px' }} >{params.username.charAt(0).toUpperCase()}</Avatar>
            <Box component={'div'} sx={{ mt: '80px', ml: '60px' }} >
                <Typography sx={{ fontSize: '25px' }}>{`${userInfo.firstName} ${userInfo.lastName}`}</Typography>
                <Typography component={'p'}>
                    {userInfo.profile && userInfo.profile.about ? userInfo.profile.about : "No information available"}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row-reverse', marginRight: '50px', mt: '80px' }}>
                {username === params.username ?
                    '' :
                    isContactExist() ?
                        <Button variant="outlined" sx={{ width: '200px', height: '80px' }}  onClick={removeHandler}  >Remove Contact</Button>
                        :
                        <Button variant="outlined" sx={{ width: '200px', height: '80px' }}   onClick={addHandler} >Add Contact</Button>
                }

            </Box>
        </Box>
    )

}