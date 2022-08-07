import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'

export const Navbar = () => {
  const {state, dispatch} = useContext(UserContext);
  const navigate = useNavigate();
  const logOut = () =>{
    localStorage.clear();
    dispatch({type:"CLEAR"});      
    navigate("/signin");
  }
  const renderList = () =>{
    if(state){
      return (
        <>
          <li><Link to = "/myFollowing">FOLLOWING</Link></li>
          <li><Link to = "/profile" title={state.name}>PROFILE</Link></li>
          <li><Link to = "/createPost">CREATE POST</Link></li>
          <li><a className="waves-effect waves-teal btn-flat #4db6ac teal lighten-2 white-text" onClick={()=>{logOut()}}>LOGOUT</a>
          </li>
        </>
      )
    }
    else{
      return (
        <>
          <li><Link to="/signin">SIGN IN</Link></li>
          <li><Link to="/signup">SIGN UP</Link></li>
        </>
      )
    }
  }
  return (
    <div className='navbar'>
         <nav>
            <div className = "nav-wrapper">
            <Link to={state?"/":"/signin"} className = "brand-logo left logo">SONET</Link>
            <ul id="nav-mobile" className = "right hide-on-med-and-down">{renderList()}</ul>
            </div>
        </nav>
    </div>
  )
}
