import React, { useState } from "react";
import { Box } from "@mui/material";
import SignIn from "../component/SignIn";
import SignUp from "../component/SignUp";



export default function Home() {
    const [changeColor, setChangeColor] = useState(false);

    return (
        <Box component={"div"}
            sx={{
                margin: '0px',
                padding: '0px',
                background: 'linear-gradient(to right, #E3E1E3, #CDD8FE)',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Box component={"div"}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    flexDirection: 'row',
                    mt: '80px',
                    borderRadius: '10px',
                    border: '1px solid none',
                    width: '800px',
                    height: '460px',
                    backgroundColor:'#ffffff',

                }} >
                <Box component={"div"} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: changeColor ? '#5A64C0' : '#ffffff',
                    width: '100%',
                    height: '100%',
                    borderTopLeftRadius: '10px',
                    borderBottomLeftRadius: '10px',
                    borderTopRightRadius: '120px',
                    borderBottomRightRadius: '120px',
                    transition:'0.3s ease', 
                }} >

                    <SignIn setChangeColor={setChangeColor} changeColor={changeColor} />

                </Box>
                <Box component={"div"} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: !changeColor ? '#5A64C0' : '#ffffff',
                    width: '100%',
                    height: '100%',
                    borderTopLeftRadius: '120px',
                    borderBottomLeftRadius: '120px',
                    borderTopRightRadius: '10px',
                    borderBottomRightRadius: '10px',
                    transition:'0.3s ease', 
                }} >

                    
                    <SignUp setChangeColor={setChangeColor} changeColor={changeColor} />
                </Box>
            </Box>
        </Box>
    )
}