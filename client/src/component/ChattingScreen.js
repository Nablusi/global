import React, { useEffect, useState } from "react";
import { Box, TextField, Avatar, Typography, IconButton, Button } from '@mui/material';
import bgRoom from '../image/bg-2.jpg';
import SendIcon from '@mui/icons-material/Send';
import io from 'socket.io-client';
import instance from "../config/axios";
import '../style/dotStyling.css';
import InputEmoji from 'react-input-emoji'



export default function ChattingScreen(props) {
    const firstName = props.contactInfo.firstName;
    const lastName = props.contactInfo.lastName;
    const username = props.contactInfo.username;
    const socket = io.connect('http://localhost:3001');
    const user = JSON.parse(localStorage.getItem('user'));
    const userThatSendMessage = user.username;
    const [message, setMessage] = useState('');
    const [receivedMessage, setReceivedMessage] = useState({});
    const room = (username + userThatSendMessage).toLowerCase().split('').sort().join('');
    const [messageList, setMessageList] = useState([]);
    const token = user.JWT;
    const [refresh, setRefresh] = useState(false);

    const [typingContent, setTypingContent] = useState({});




    const [text, setText] = useState('')

    function handleOnEnter(text) {
        console.log('enter', text)
    }

    const isTyping = async () => {
        try {
            await socket.emit('is-typing',
                {
                    userThatTyping: userThatSendMessage,
                    userThatReceived: username,
                    text: text,
                });

            console.log('Socket send data of typing content');
        } catch (error) {
            console.log("Error In Receiving Content of Typing " + error);
        }
    }
    const receicedTypingContent = async () => {
        await socket.on('typing', (data) => {
            setTypingContent(data)

        });
    }






    const joinRoomHandler = () => {
        socket.emit('join-room', room);

    }

    const clearMessages = () => {
        setMessageList([]);
    };



    useEffect(() => {
        isTyping();

    }, [text, room]);

    useEffect(() => {
        receicedTypingContent();
        console.log(typingContent.isTyping);
    }, [text]);




    useEffect(() => {
        joinRoomHandler();
        clearMessages();

        socket.on('received-message', (data) => {
            setReceivedMessage(data);
            setMessageList(prevMessages => [...prevMessages, data]);

        });

        return () => {
            socket.off('received-message');
        };
    }, [room, props.refresh]);



    const sendMessageHandler = async () => {
        await socket.emit('send-message', {
            userThatReceivedMessage: username,
            userThatSendMessage: userThatSendMessage,
            message: text,
            room: room,
        });

        const response = await instance.post(`/messages/${room}/chat`,
            { sender: userThatSendMessage, receiver: username, message: text },
            { headers: { Authorization: token } }
        );
        console.log('the response of fetch ', response.data);
    }



    return (

        props.appearChattingScreen ?
            <Box component={'div'} sx={{ display: 'flex', gap: '10px', flexDirection: 'column' }} >
                <Box component={'div'} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: '10px' }} >
                    <Avatar>{username.charAt(0).toUpperCase()}</Avatar>
                    <Box>
                        <Typography component={'h2'}>{`${firstName} ${lastName}`}</Typography>
                        <Typography component={'p'} sx={{ fontSize: '14px' }} ></Typography>
                    </Box>
                </Box>
                <Box component={'div'} sx={{
                    height: '480px',
                    position: 'relative',
                    width: '100%',
                    overflowY: 'auto',
                    backgroundImage: `url(${bgRoom})`,
                    backgroundRepeat: 'repeat-y',
                }}>
                    {props.chatterInfo.messages ? props.chatterInfo.messages.map((receivedMsg, index) => (
                        <Box key={index} component={'div'} sx={{ width: '100%', display: 'flex', flexDirection: 'column', flexDirection: receivedMsg.sender === userThatSendMessage ? 'row' : 'row-reverse' }}  >
                            <Typography component={'p'} sx={{
                                zIndex: '2', borderRadius: '15px', backgroundColor: receivedMsg.sender === userThatSendMessage ? 'green' : 'blue', width: 'fit-content', margin: '10px', position: 'relative', padding: '5px', color: 'white', display: 'flex', flexDirection: 'column',
                            }} >{receivedMsg.content}

                            </Typography>
                        </Box>
                    )) : ''}

                    {messageList.map((receivedMsg, index) => (
                        <Box key={index} component={'div'} sx={{ width: '100%', display: 'flex', flexDirection: 'column', flexDirection: receivedMsg.userThatReceivedMessage === userThatSendMessage ? 'row-reverse' : 'row' }}  >
                            <Typography component={'p'} sx={{
                                zIndex: '2', borderRadius: '15px', backgroundColor: receivedMsg.userThatSendMessage === userThatSendMessage ? 'green' : 'blue', width: 'fit-content', margin: '10px', position: 'relative', padding: '5px', color: 'white', display: 'flex',
                            }} >{receivedMsg.message}  </Typography>
                        </Box>
                    ))}
                </Box>




                {/* {typingContent.isTyping ? (
                    <Box sx={{
                        position: 'absolute',
                        bottom: '128px',
                        backgroundColor: 'white',
                        padding: '10px',
                        borderRadius: '10px'
                    }}>
                        {props.chattingUsername} is typing
                        <span className="one"></span>
                        <span className="two"></span>
                        <span className="three"></span>
                    </Box>
                ) : null} */}

                {/* 
                <Box sx={{
                    position: 'absolute',
                    bottom: '128px',
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '10px'
                }}>
                    seen
                </Box> */}


                <Box component={'div'} sx={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }} >
                    <InputEmoji
                        style={{
                            width: '100%',
                            paddingLeft: '50px',
                            height: '50px',
                            borderRadius: '15px'
                        }}
                        value={text}
                        onChange={setText}
                        cleanOnEnter
                        onEnter={handleOnEnter}
                        placeholder="Type a message"

                    />

                    <Button sx={{ position: 'absolute', borderRadius: '50%', fontSize: '20px' }}  > </Button>

                    <IconButton onClick={sendMessageHandler} ><SendIcon /></IconButton>
                </Box>
            </Box>
            :
            ''
    )
}
