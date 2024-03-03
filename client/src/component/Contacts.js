import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import instance from '../config/axios';
import { useParams, Link } from "react-router-dom";
import io from 'socket.io-client';



export default function Contacts(props) {
    const user = JSON.parse(localStorage.getItem('user'));
    const [contactsInfo, setContactsInfo] = useState([]);
    const [search, setSearch] = useState('');
    const username = user.username;
    const params = useParams();
    const token = user.JWT;
    const socket = io.connect('http://localhost:3001');
    const [searchedContact, setSearchedContacts] = useState([]);
    const userId = user.userId;
    const [activeUsers, setActiveUsers] = useState([]);
    


    const getContacts = async () => {
        try {
            const response = await instance.get(`/home/contacts/${params.username}`, {
                headers: {
                    Authorization: token,
                }
            });
            setContactsInfo(response.data.contacts);

        } catch (e) {
            console.log('Getting Contacts Error' + e);
        }
    }

    const SearchForUserName = async (query) => {
        try {
            await socket.emit('get-contacts', query);
            await socket.on('send-contact', (data) => {
                setSearchedContacts(data);
            });

        } catch (error) {
            console.log("Query Error " + error);
        }
    }

    function changeSearchHandler(e) {
        setSearch(e.target.value);
        if (e.target.value !== '' || e.target.value !== null) {
            SearchForUserName(search);
        }
    }


    const receivedContacts = searchedContact.map((contact) =>
        <Box key={contact.username} component={"div"}
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'space-between',
                mt: '10px',
                mb: '10px',
                borderRadius: '15px',
                border: '1px solid lightblue',
                padding: '10px',
                boxShadow: '10px 10px 5px lightblue',
            }}
        >
            <Link to={`/users/profile/${contact.username}`} style={{ textDecoration: 'none' }} ><Avatar>{contact.username.charAt(0).toUpperCase()}</Avatar></Link>
            <Typography>{`${contact.firstName} ${contact.lastName} `}</Typography>
        </Box>
    );


    const onlineUsers = async () => {
        await socket.emit('new-user-add', userId);
        await socket.on('get-users', (data) => {
            setActiveUsers(data);
        });

    }




    async function startChattingHandler(contact) {
        props.setAppearChattingScreen(true);
        props.setContactInfo(contact);
        const room = (username + contact.username).toLowerCase().split('').sort().join('');

        try {
            const response = await instance.get(`/messages/${room}`, {
                headers: {
                    Authorization: token,
                },
            });
            if (response.status === 404) {
                console.log('No messages found for the room');
                await props.setChatterInfo({ messages: [] }); 
            } else {
               
                const messages = response.data.messages || [];
                await props.setChatterInfo({ messages }); 
                console.log(response.data);
            }

        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('No messages found for the room');
                await props.setChatterInfo({ messages: [] }); 
            } else {
                console.error('Error fetching messages:', error);
            }
            

        }
        props.setRefresh(!props.refresh); 
    }



    useEffect(() => {
        getContacts();
        onlineUsers();
    }, []);




    const getAllContacts = contactsInfo.map((contact) => {
        const isUserActive = activeUsers.some((user) => user.userId === contact.userId);

        return (
            <Box key={contact.username} component={"div"}
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between',
                    mt: '10px',
                    mb: '10px',
                    position: 'relative',
                    borderRadius: '15px',
                    border: '1px solid lightblue',
                    padding: '10px',
                    boxShadow: '10px 10px 5px lightblue',
                    transition: '0.3s ease',
                }}
            >
                <Link to={`/users/profile/${contact.username}`} style={{ textDecoration: 'none' }} ><Avatar>{contact.username.charAt(0).toUpperCase()}</Avatar></Link>
                <Box sx={{ position: 'absolute', height: '10px', width: '10px', backgroundColor: isUserActive ? 'green' : 'grey', borderRadius: '50%', left: '43px' }}></Box>
                <Button onClick={() => startChattingHandler({ username: contact.username, firstName: contact.firstName, lastName: contact.lastName })}> start chatting </Button>

            </Box>
        );
    });


    return (
        <Box component={'div'}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                width: '100%',
                height: '100vh',
                overflow: 'hidden'
            }}
        >
            <Box component={'div'}
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center'
                }}
            >
                <Typography component={'h2'}>
                    Contacts
                </Typography>
                <Link to={`/users/profile/${params.username}`} style={{ textDecoration: 'none' }} ><Avatar>{username.charAt(0).toUpperCase()}</Avatar></Link>
            </Box>
            <Box component={'div'} sx={{ width: '100%', mt: '20px' }}>
                <TextField variant="outlined" label='Search Contacts' sx={{ width: '100%' }} onChange={changeSearchHandler} />
            </Box>


            <Box component={'div'}
                sx={{
                    position: 'absolute',
                    top: '117px',
                    zIndex: '1',
                    backgroundColor: search === '' ? '' : 'white',
                    height: 'fit-content',
                    transition: '0.3s ease',
                    padding: '5px',
                    width: '100%',
                    overflowY: 'auto'
                }}
            >



                {search === '' ? '' : receivedContacts}
            </Box>
            <Box sx={{ overflowY: 'auto' }}>
                {getAllContacts}

            </Box>

        </Box>
    )
}