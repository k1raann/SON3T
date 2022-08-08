import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'

export const Profile = () => {
  const {state, dispatch} = useContext(UserContext);
  const [myPosts, setMyPosts] = useState([])
  const [image,setImage] = useState("");
  const [changeDp,setChangeDp] = useState(false);
  const [userId, setUserId] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch("/myPosts",{headers : {"Authorization" : "Bearer" + localStorage.getItem("jwt")}})
    .then(res => res.json()).then(result => {
      setMyPosts(result)
    }).catch(err => console.log(err))
   }, [])

  const changePic = (userId) => { 
      setChangeDp(true)
      setUserId(userId);
   }

   const postDp = (file) => { 
    const data = new FormData();
    // console.log(image)
    data.append("file",file);
    data.append("upload_preset","SONETS");
    data.append("cloud_name","kiloud");
    fetch("https://api.cloudinary.com/v1_1/kiloud/image/upload",{
      method:"post",
      body:data,
    }).then(res=>res.json()).then(data=>{setImage(data.url)}).catch(err=>console.log(err));
    setFile(null);
     }

     useEffect(() => {
      if(image){
        // console.log(image);
      fetch("/changePicture",{  method:"put", 
      headers : {"Content-Type" : "application/json",
                 "Authorization" : "Bearer" + localStorage.getItem("jwt")},
      body : JSON.stringify({userId : userId,
                              pic : image})
                            })
    .then(res => res.json()).then(result => {
      if(result.prof)
      {
      dispatch({type : "UPDATE_USER",payload:result.prof})
      // console.log(result,state);
      }
    }).catch(err => console.log(err));
      }
     }, [image]) 
     
   
  return (
    <div className='profile'>    
    <div className='profile-info'>
        <div>
        <div className='prof-pic'>
        <img src={state.dp} alt="profile pic" className='prof-dp'/>
        <a className='centered' onClick={()=>{changePic(state._id)}}>change photo</a>
        </div>
        </div>
        {changeDp && 
          <div className='row toggle'>
                <div className="card grey lighten-5">
                  <div className='file-card-content'>
                    <form action="#" >
                        <div className="file-field input-field">
                        <div className="btn">
                            <span>File</span>
                            <input type="file" accept="image/*" onChange={(e)=>{setFile(e.target.files[0])}}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" placeholder="Upload image"/>
                        </div>
                        </div>
                    </form>
                    </div>
                  <div className='center-align'>
                    {file?<button className='btn-flat' onClick={()=>{postDp(file);setChangeDp(false);}}>upload</button>
                    :null}<button className='btn-flat' onClick={()=>{setChangeDp(false)}}>close</button>
                  </div>
              </div>
          </div>
        }
        <div>
        <h4>{state.name}</h4>
        <div className='profile-data'>
            <h6>{myPosts.length} POSTS</h6>
            <h6>{state?(state.followers?state.followers.length:null):null} FOLLOWERS</h6>
            <h6>{state?(state.following?state.following.length:null):null} FOLLOWING</h6>
        </div>
        </div>
    </div>
        <div className='profile-posts'>
            {myPosts.map(item => {
              return(
                <img src={item.photo} key = {item._id} alt="post" className='prof-post'/>
              )
            })}
        </div>
    </div>
  )
}
