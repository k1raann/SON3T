import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { UserContext } from '../../App'

export const UserProfile = () => {
  const {state, dispatch} = useContext(UserContext);
  const {userId} = useParams();
  const [prof, setProf] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showFollow, setShowFollow] = useState(state.following.includes(userId)?false:true);
  
  useEffect(() => {
    // setShowFollow(state.following.includes(userId)?false:true)
    fetch(`/user/${userId}`,{headers : {
        "Content-Type" : "application/json",
        "Authorization" : "Bearer" + localStorage.getItem("jwt")}})
    .then(res => res.json()).then(result => {
    // console.log(result);
      setProf(result);
      // console.log(prof);
      if(prof)
      setShowFollow(prof.user.followers.includes(state._id)?(false):true);
    }).catch(err => console.log(err))
   }, [])

   const follow = (userId) => { 
        fetch("/follow",{
            method:"put",
            headers:{"Content-Type" : "application/json",
                    "Authorization" : "Bearer" + localStorage.getItem("jwt")},
            body : JSON.stringify({followId:userId})
        }).then(res=>res.json()).then(data=>{
            // console.log(data);
            setUserProfile(data.followUser)
            setShowFollow(false)
            // dispatch({type:"UPDATE"},{payload : {
            //     following:data.following,
            //     followers:data.followers
            // }})
            dispatch({type : "UPDATE_USER",payload:data.followingUser});
        })
    }

    const unfollow = (userId) => { 
        fetch("/unfollow",{
            method:"put",
            headers:{"Content-Type" : "application/json",
                    "Authorization" : "Bearer" + localStorage.getItem("jwt")},
            body : JSON.stringify({followId:userId})
        }).then(res=>res.json()).then(data=>{
            // console.log(data);
            setUserProfile(data.followUser)
            setShowFollow(true)
            // dispatch({type:"UPDATE"},{payload : {
            //     following:data.following,
            //     followers:data.followers
            // }})
            dispatch({type : "UPDATE_USER",payload:data.followingUser});
        })
}

  return (
    <div className='profile'>    
    <div className='profile-info'>
        <div>
        <img src={prof?prof.user.dp:null} alt="profile photo" className='prof-dp'/>
        </div>
        <div>
        <h4>{prof?prof.user.name:null}</h4>
        <div className='profile-data'>
            <h6>{prof?prof.posts.length:null} POSTS</h6>
            <h6>{prof?(userProfile?userProfile.followers.length:prof.user.followers.length):null} FOLLOWERS</h6>
            <h6>{prof?(userProfile?userProfile.following.length:prof.user.following.length):null} FOLLOWING</h6>
            {/* <h6>{state.followers!==undefined?state.followers.length:null} FOLLOWERS</h6>
            <h6>{state.following!==undefined?state.following.length:null} FOLLOWING</h6> */}
        </div>
        {(showFollow===null)?"loading...":(showFollow?<button className="btn-small #039be5 light-blue darken-1" type="submit" name="action" onClick={()=>{follow(prof.user._id)}}>Follow
              </button>:<button className="btn-small #f44336 red" type="submit" name="action" onClick={()=>{unfollow(prof.user._id)}}>unfollow
              </button>)} 
        </div>
    </div>
        <div className='profile-posts'>
        {
            prof?prof.posts.map(item => {
              return(
                <img src={item.photo} key = {item._id} alt="post" className='prof-post'/>
              )
            }):<>loading...</>
        }
        </div>
    </div>
  )
}
