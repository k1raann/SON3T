import React, { useContext, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import M from "materialize-css"

export const Navbar = () => {
  const {state, dispatch} = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
      var elems = window.document.querySelectorAll('.sidenav');
      M.Sidenav.init(elems, {});
  }, []);

  const logOut = () =>{
    localStorage.clear();
    dispatch({type:"CLEAR"});      
    navigate("/signin");
  }
  const renderList = () =>{
    if(state){
      return (
        <>
          <ul className='hide-on-med-and-down'>
          <li><Link to = "/myFollowing">FOLLOWING</Link></li>
          <li><Link to = "/profile" title={state.name}>PROFILE</Link></li>
          <li><Link to = "/createPost">CREATE POST</Link></li>
          <li><a className="waves-effect waves-teal btn-flat #4db6ac teal lighten-2 white-text" onClick={()=>{logOut()}}>LOGOUT</a>
          </li>
          </ul>

          <ul className="sidenav" id="mobile-demo">
          <li><Link to = "/myFollowing">FOLLOWING</Link></li>
          <li><Link to = "/profile" title={state.name}>PROFILE</Link></li>
          <li><Link to = "/createPost">CREATE POST</Link></li>
          <li><a className="waves-effect waves-teal btn-flat #4db6ac teal lighten-2 white-text" onClick={()=>{logOut()}}>LOGOUT</a>
          </li> 
          </ul>
        </>
      )
    }
    else{
      return (
        <>
          <ul className='hide-on-med-and-down'>
          <li><Link to="/signin">SIGN IN</Link></li>
          <li><Link to="/signup">SIGN UP</Link></li>
          </ul>

          <ul className="sidenav" id="mobile-demo">
          <li><Link to="/signin">SIGN IN</Link></li>
          <li><Link to="/signup">SIGN UP</Link></li>
          </ul>
        </>
      )
    }
  }
  return (
    <div className='navbar'>
         <nav>
            <div className = "nav-wrapper">
            <Link to={state?"/":"/signin"} className = "brand-logo left logo">SONET</Link>
            <a href="#" data-target="mobile-demo" className="right sidenav-trigger" ><i className="material-icons">menu</i></a>
            <ul className = "right show-on-med-and-down">{renderList()}</ul>
            </div>
        </nav>
    </div>
  )
}
