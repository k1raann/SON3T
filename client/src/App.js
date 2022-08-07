import React, { createContext, useContext, useEffect, useReducer } from 'react';
import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom'
import './App.css';
import { Navbar } from './components/navbar';
import { CreatePost } from './components/screens/createpost';
import { Home } from './components/screens/home';
import { MyFollowing } from './components/screens/myFollowing';
import { Profile } from './components/screens/profile';
import { Signin } from './components/screens/signin';
import { Signup } from './components/screens/signup';
import { UserProfile } from './components/screens/UserProfile';
import { initialState, reducer } from './reducers/userReducer';

export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const {state, dispatch} = useContext(UserContext);
  useEffect(()=>{
    {
      const user = JSON.parse(localStorage.getItem("user"));
      if(user){
        dispatch({type : "USER",payload : user});
        navigate("/");
      }
      else{
        navigate("/signin")
      }
    }
  },[])
  return <Routes>
            <Route exact path = "/" element = {<Home/>}/>
            <Route exact path = "/signin" element = {<Signin/>}/>
            <Route exact path = "/signup" element = {<Signup/>}/>
            <Route exact path = "/profile" element = {state?<Profile/>:<Signin/>}/>
            <Route exact path = "/createPost" element = {<CreatePost/>}/>
            <Route exact path = "/profile/:userId" element = {<UserProfile/>}/>
            <Route exact path = "/myFollowing" element = {<MyFollowing/>}/>
        </Routes>
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState);
  return (
    <div className="App">
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Navbar/>
    <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
    </div>
  );
}

export default App;
