import { Route, createBrowserRouter, RouterProvider, createRoutesFromElements } from 'react-router-dom';
import Home from './pages/Home';
import 'react-toastify/dist/ReactToastify.css';
import { CssBaseline } from "@mui/material";
import { ToastContainer } from 'react-toastify';
import MainChatting from './pages/MainChatting';
import Profile from './pages/Profile';


const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='/' element={<Home />} />
    <Route path='/home/:username' element={<MainChatting />} /> 
    <Route path='/users/profile/:username' element={<Profile   /> } />
  </>
));


function App() {

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
      <CssBaseline />
    </>

  );
}

export default App;
