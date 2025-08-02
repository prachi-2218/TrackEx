import React, { useState } from "react";
import "./style.css";
import Input from "../Input";
import Button from "../Button";
// import firebase from 'firebase/app';
// import 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth,db,provider} from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, getDoc,setDoc } from "firebase/firestore"; 
import {signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function SignupSigninComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate=useNavigate();
  

  function signupWithEmail() {
    setLoading(true);
    console.log("Name", name);
    console.log("Email", email);
    console.log("Password", password);
    console.log("ConfirmPassword", confirmpassword);

    //Authenticate with ID and password
    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      confirmpassword !== ""
    ) {
      if (password === confirmpassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log("User>>>", user);
            toast.success("User Created!");
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmpassword("");
            navigate("/dashboard")
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
            // ..
          });
      } else {
        toast.error("Passwords do not match :(");
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  //for already existing account
  function loginUsingEmail() {
    console.log("Email", email);
    console.log("Password", password);
    setLoading(true);

    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          toast.success("User Logged In !");
          console.log("User Logged in",user);
          setLoading(false);
          navigate("/dashboard");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setLoading(false);
          toast.error(errorMessage);
        });
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  async function createDoc(user)
  { setLoading(true);
    //make sure that the doc with the uid doesn't exist
    if(!user) return;

    const userRef=doc(db,"users",user.uid);
    const userData=await getDoc(userRef);
    if(!userData.exists()){
        const { displayName, email, photoURL } = user;
        const createdAt = new Date();
    try {
        await setDoc(doc(db, "users", user.uid), {
            name:displayName? displayName:name,
            email,
            photoURL:photoURL?photoURL:"",
            createdAt,
            
        });
        toast.success("Doc Created");
        setLoading(false);
    } catch (e) {
        toast.error(e.message);
        setLoading(false);
    }}

    else{
        // toast.error("Doc already exists");
        setLoading(false); 
    }   
  }

  const googleAuth=async ()=>{
    setLoading(true);
    try {
        signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log("User>>>",user);
            createDoc(user);
            toast.success("User Authenticated !");
            setLoading(false);
            navigate("/dashboard");
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            // Handle Errors here.
            setLoading(false);
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            
        });
    } catch (e) {
        toast.error(e.message);
        setLoading(false);
    }
}
   
  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login on<span style={{ color: "var(--theme)" }}> TrackEx.</span>
          </h2>
          <form>
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"prachi@gmail.com"}
            />
          </form>
          <form>
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@12345"}
            />
          </form>
          <Button
            disabled={loading}
            text={loading ? "Loading..." : "Login with Email and Password"}
            onClick={signupWithEmail}
          />
          <p className="p-login">OR</p>
          <Button disabled={loading} onClick={googleAuth} text={loading ? "Loading..." :"Login with Google"} blue={true} />
          <p
            className="p-login"
            style={{ cursor: "pointer" }}
            onClick={() => setLoginForm(!loginForm)}
          >
            or Don't have an account?Click Here
          </p>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Hey! Sign up first on
            <span style={{ color: "var(--theme)" }}> TrackEx.</span>
          </h2>
          <form>
            <Input
              label={"Full Name"}
              state={name}
              setState={setName}
              placeholder={"Prachi Bansal"}
            />
          </form>
          <form>
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"prachi@gmail.com"}
            />
          </form>
          <form>
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@12345"}
            />
          </form>
          <form>
            <Input
              type="password"
              label={"Confirm Password"}
              state={confirmpassword}
              setState={setConfirmpassword}
              placeholder={"Example@12345"}
            />
          </form>
          <Button
            disabled={loading}
            text={loading ? "Loading..." : "SignUp using Email and Password"}
            onClick={signupWithEmail}
          />
          <p className="p-login">OR</p>
          <Button disabled={loading} onClick={googleAuth} text={loading ? "Loading..." :"SignUp using Google"} blue={true} />
          <p
            className="p-login"
            style={{ cursor: "pointer" }}
            onClick={() => setLoginForm(!loginForm)}
          >
            or Have an account already? Click Here
          </p>
        </div>
      )}
    </>
  );
}

export default SignupSigninComponent;
