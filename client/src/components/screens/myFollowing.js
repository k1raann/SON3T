import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App';
import M from "materialize-css";
import { Link, Navigate } from 'react-router-dom';

export const MyFollowing = () => {
    const [data, setData] = useState([]);
    const {state, dispatch} = useContext(UserContext);
    const profUser = JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
     fetch("/myFollowing",{headers : {"Content-Type" : "application/json",
        "Authorization" : "Bearer" + localStorage.getItem("jwt")}})
     .then(res => res.json()).then(result => {//console.log(result);
        setData(result)})
    }, [])
    
    const likePost = (id) => {
        fetch("/like", {
            method : "put",
            headers : {"Content-Type":"application/json",
                       "authorization":"Bearer"+localStorage.getItem("jwt")},
            body : JSON.stringify({postId : id})
        }).then(res=>res.json()).then(result => {
            const newData = data.map(item => {
                return (item._id === result._id)?result:item
            })
            setData(newData)
        }).catch(err => console.log(err))
    }

    const unlikePost = (id) => {
        fetch("/unlike", {
            method : "put",
            headers : {"Content-Type":"application/json",
                       "authorization":"Bearer"+localStorage.getItem("jwt")},
            body : JSON.stringify({postId : id})
        }).then(res=>res.json()).then(result => {
            const newData = data.map(item => {
                return (item._id === result._id)?result:item
            })
            setData(newData)
        }).catch(err => console.log(err))
    }

    const makeComment = (text, postId) => {
        fetch("/comment", {
            method : "put",
            headers : {"Content-Type":"application/json",
                       "authorization":"Bearer"+localStorage.getItem("jwt")},
            body : JSON.stringify({postId, text})
        })
        .then(res=>res.json()).then(result => {
            const newData = data.map(item => {
                return (item._id === result._id)?result:item
            })
            setData(newData)
        }).catch(err => console.log(err))
    }

    const likeText = (val) =>{
        if(val===1)
        return <span >{val} like</span>
        else
        return <span>{val} likes</span>
    }

    const deletePost = (postId) =>{
        fetch(`/deletePost/${postId}`,{
            method:'delete',
            headers:{"authorization":"Bearer"+localStorage.getItem("jwt")}
        }).then(res=>res.json()).then(result=>{
            // console.log(result);
            const newData = data.filter(item =>{
                return item._id!==result._id
            })
            setData(newData)
            if(!result.error)
                {M.toast({html: "Post deleted successfully!", classes : "#a5d6a7 green lighten-3"})}
            })
    }

  return (
    <div className="home">
        {
            data.map(item => {
                return(
                    <div className='card home-card' key = {item._id}>
                        <h5><span><Link to = {(profUser._id!==item.postedBy._id)?(`/profile/${item.postedBy._id}`):"/profile"}>{item.postedBy.name}</Link></span>{state.name===item.postedBy.name?<i className="material-icons grey-text"style={{float:"right"}} onClick={()=>deletePost(item._id)}>delete</i>:null}</h5>
                        <div className='card-image'>
                            <img src={item.photo} alt="home post"/>
                        </div>
                        <div className='card-content'>
                            {item.likes.includes(state._id)?
                            <i className="material-icons #039be5 blue-text" onClick={(e) =>{e.preventDefault();unlikePost(item._id)}}>favorite</i>
                            :<i className="material-icons" onClick={(e) =>{e.preventDefault();likePost(item._id)}}>favorite_border</i>}
                            <h6>{likeText(item.likes.length)}</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {item.comments.map(record => {
                                return(<div key={record._id}> <span style={{fontWeight:"bold", display:"inline"}}>{record.postedBy.name} </span>{record.text}</div>)
                            })}
                            <form onSubmit={(e)=>{e.preventDefault(); makeComment(e.target[0].value, item._id);e.target[0].value=""}}>
                            <input type="text" placeholder="add a comment"/>
                            </form>
                        </div>
                    </div>
                )
            })
        }
    </div>
  )
}
