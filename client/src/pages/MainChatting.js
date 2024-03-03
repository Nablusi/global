import React, { useState } from "react";
import { Box } from '@mui/material';
import Contacts from "../component/Contacts";
import ChattingScreen from "../component/ChattingScreen";

export default function MainChatting() {
    const [appearChattingScreen, setAppearChattingScreen] = useState(false);
    const [contactInfo, setContactInfo] = useState('');  
    const [messagesInfo, setMessgesInfo] = useState([]);
    const [chatterInfo, setChatterInfo] = useState({});  
    const [refresh, setRefresh] = useState(false);



    return (
        <Box component={'div'}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                background: 'linear-gradient(to right, #E3E1E3, #CDD8FE)',
                height: '100vh',
                overflow: 'hidden',
            }}>
            <Box component={'div'} sx={{ width: '30%', mt: '80px', ml: '50px', mr: '50px' }} >
                <Contacts  setAppearChattingScreen = {setAppearChattingScreen} setContactInfo ={setContactInfo}  setMessgesInfo={setMessgesInfo}  setChatterInfo ={setChatterInfo}  setRefresh={setRefresh} refresh={refresh} />

            </Box>
            <Box component={'div'} sx={{ width: '70%', mt: '80px', ml: '50px', mr: '50px' }} >
                <ChattingScreen appearChattingScreen ={appearChattingScreen}  contactInfo={contactInfo}  messagesInfo={messagesInfo}   chatterInfo ={ chatterInfo}    refresh={refresh}  />
            </Box>
        </Box>
    )
}