
import React from 'react'
import "./style.css";
import { useNavigate } from 'react-router-dom';
import {useAuthState} from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import { useEffect } from "react";
import userImg from "../../assets/user.svg"
function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate=useNavigate();

  useEffect(() => {
    if(user)
    {
      navigate("/dashboard");
    }
  }, [user,loading]);
  
  function logoutFun(){
    try {
      signOut(auth).then(() => {
        // Sign-out successful.
        toast.success("Logged out successfully!");
        navigate("/");
      }).catch((error) => {
        // An error happened.
        toast.error(error.message);
      });
    } catch (error) {
      toast.error(error.message);
    }
    
  }
  return (
    <div className="navbar">
      <p className="logo">TrackEx.</p>
      {user && (
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
      <img src={user.photoURL? user.photoURL:userImg}
        style={{borderRadius:"50%" ,height:"1.5rem",width:"1.5rem"}}
      />
      <p className="logo link" onClick={logoutFun}>LogOut</p>
      </div>
    )}
    </div>
  );
}

export default Header
