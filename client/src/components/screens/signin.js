import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import M from "materialize-css"
import { UserContext } from '../../App'

export const Signin = () => {
  const {state,dispatch} = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const postData = () =>{
    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) && email!==""){
      M.toast({html: "Invalid Email", classes : "#d50000 red accent-4"});
      return;
    }
    fetch("/signin", {method : "post",
    headers : {"Content-Type":"application/json"},
    body : JSON.stringify({
      email:email,
      password:password
    })}).then(res=>res.json()).then(data=>{
      console.log(data);
      if(data.error){
        var errMsg = data.error;
        if(errMsg==="Email doesn't exist!")
        {
          // <button class="btn-flat toast-action" onClick={()=>{navigate("/signup")}}></button>
          errMsg += ' Signup to continue'
        }
        M.toast({html: errMsg, classes : "#d50000 red accent-4"});
      }
      else{
        // console.log(data);
        dispatch({type : "USER", payload:data.user})
        localStorage.setItem("jwt",data.token);
        localStorage.setItem("user",JSON.stringify(data.user));
        M.toast({html: data.message, classes : "#00c853 green accent-4"})
        navigate("/");
      }
    }).catch(err=>{console.log(err)});
    
  }
  return (
    <div className='authcard'>
      <div className="row">
        <div className="col s12 m6">
          <div className="card z-depth-5">
            <div className="card-content ">
              <span className="card-title">SIGNIN</span>
              <input type="text" placeholder='Email' value={email} onChange={(e)=>{setemail(e.target.value)}}/>
              <input type="password" placeholder='Password' value = {password} onChange={(e)=>{setpassword(e.target.value)}}/>
              <button className="btn waves-effect waves-light" type="submit" name="action" onClick={()=>{postData()}}>Signin
                <i className="material-icons right">send</i>
              </button>
              <Link to = "/signup"><h6>Don't have an account?</h6></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
