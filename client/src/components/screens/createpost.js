import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import M from 'materialize-css';

export const CreatePost = () => {
  const navigate = useNavigate();
  const [title, settitle] = useState("");
  const [body, setbody] = useState("");
  const [image, setimage] = useState("");
  const [url, seturl] = useState("");
      
  useEffect(() => {
    if(url)
    {
     fetch("/createPost", {method : "post",
     headers : {"Content-Type":"application/json",
                "authorization":"Bearer"+localStorage.getItem("jwt")
             },
     body : JSON.stringify({
       title:title,
       body:body,
       pic:url
     })}).then(res=>res.json()).then(data=>{
       if(data.error){
         M.toast({html: data.error, classes : "#d50000 red accent-4"});
       }
       else{
         //console.log(title,body,url)
         M.toast({html: "Post created Successfully!", classes : "#00c853 green accent-4"})
         navigate("/");
       }
     }).catch(err=>{console.log(err);});
   }
   }, [url])
  
  const postDetails =()=>{
    if(!title||!body||!image){
      M.toast({html: "Please provide all the details", classes : "#d50000 red accent-4"});
      return;
    }
    const data = new FormData();
    // console.log(image)
    data.append("file",image);
    data.append("upload_preset","SONETS");
    data.append("cloud_name","kiloud");
    fetch("https://api.cloudinary.com/v1_1/kiloud/image/upload",{
      method:"post",
      body:data
    }).then(res=>res.json()).then(data=>{seturl(data.url)}).catch(err=>console.log(err));
  }

  return (
    <div className='createpost'>
        <div className='card create-post-card'>
            <div className='card-content'>
              <input type="text" placeholder='Title' value={title} onChange={(e)=>{settitle(e.target.value)}}/>
              <input type="text" placeholder='Description' value={body} onChange={(e)=>{setbody(e.target.value)}}/>
              <form action="#">
                    <div className="file-field input-field">
                    <div className="btn">
                        <span>File</span>
                        <input type="file" accept="image/*" onChange={(e)=>{setimage(e.target.files[0])}}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" placeholder="Upload image"/>
                    </div>
                    </div>
                </form>
                <button className="btn waves-effect waves-light" type="submit" name="action" onClick={()=>{postDetails()}}>Upload</button>
            </div>
        </div>
    </div>
  )
}
