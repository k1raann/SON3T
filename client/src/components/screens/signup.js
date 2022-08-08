import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import M from "materialize-css"

export const Signup = () => {
  const navigate = useNavigate();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [image, setImage] = useState("");
  const [dp,setDp] = useState(null);
  const [isDp, setIsDp] = useState(false)

  useEffect(() => {
    
    if(dp){
      if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        M.toast({html: "Invalid Email", classes : "#d50000 red accent-4"});
        return;
      }
    fetch("/signup", {method : "post",
    headers : {"Content-Type":"application/json"},
    body : JSON.stringify({
      name : name,
      email:email,
      password:password,
      dp:dp
    })}).then(res=>res.json()).then(data=>{
      if(data.error){
        M.toast({html: data.error, classes : "#d50000 red accent-4"});
      }
      else{
        M.toast({html: data.message, classes : "#00c853 green accent-4"})
        navigate("/signin");
      }
    }).catch(err=>{console.log(err);});}
  }, [dp])
  

  const postData = () =>{
    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      M.toast({html: "Invalid Email", classes : "#d50000 red accent-4"});
      return;
    }
    if(!isDp){
    fetch("/signup", {method : "post",
    headers : {"Content-Type":"application/json"},
    body : JSON.stringify({
      name : name,
      email:email,
      password:password
    })}).then(res=>res.json()).then(data=>{
      if(data.error){
        M.toast({html: data.error, classes : "#d50000 red accent-4"});
      }
      else{
        M.toast({html: data.message, classes : "#00c853 green accent-4"})
        navigate("/signin");
      }
    }).catch(err=>{console.log(err);});}
    }

  const postDp = () => { 
    const data = new FormData();
    // console.log(image)
    setIsDp(true);
    data.append("file",image);
    data.append("upload_preset","SONETS");
    data.append("cloud_name","kiloud");
    fetch("https://api.cloudinary.com/v1_1/kiloud/image/upload",{
      method:"post",
      body:data,
    }).then(res=>res.json()).then(data=>{setDp(data.url)}).catch(err=>console.log(err));
     }
     
  return (
    <div className='authcard'>
        <div className="row">
        <div className="col s12 m6">
          <div className="card z-depth-5">
            <div className="card-content ">
              <span className="card-title">SIGNUP</span>
              <input type="text" placeholder='Name' value = {name} onChange={(e)=>{setname(e.target.value)}}/>
              <input type="text" placeholder='Email' value = {email} onChange={(e)=>{setemail(e.target.value)}}/>
              <input type="password" placeholder='Password' value = {password} onChange={(e)=>{setpassword(e.target.value)}}/>
              <form action="#">
                    <div className="file-field input-field">
                    <div className="btn">
                        <span>File</span>
                        <input type="file" accept="image/*" onChange={(e)=>{setImage(e.target.files[0])}}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" placeholder="Upload image"/>
                    </div>
                    </div>
                </form>
              <button className="btn waves-effect waves-light" type="submit" name="action" onClick={()=>{if(image)postDp();else postData()}}>SIGNUP
                <i className="material-icons right">send</i>
              </button>
              <Link to = "/signin"><h6>Already have an account?</h6></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
