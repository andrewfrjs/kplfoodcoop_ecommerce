import React, { useState } from "react";
import { useNavigate, NavLink, Navigate } from "react-router-dom";
import  './Profile.css'

export default function EditProfile() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(false);
  const navigate = useNavigate();
  


  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    
    /*try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);
      
      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);
      
      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            
            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            console.log(err)
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }*/
  };

  
  
  return (
        <div className='auth'>
            {user && (
            <Navigate to="/profile" replace={true} />
          )}
            <form onSubmit={handleSubmit}>
                <h1>Update your account</h1>
                <input type="text" id='username' placeholder='Username' onChange={(e) => setUser(e.target.value)} required />
                <input type="email" id='email' placeholder='Email' value={"mynutrition@gmail.com"} readOnly disabled/>
                <input type="email" id='email' placeholder='Secondary Email' onChange={(e) => setUser(e.target.value)} required />
                <button className='btn' type='submit' title='submit'>Login</button>
                {
                    error && <p className='error'>{error}!</p>
                }
                {
                    success && <p className='success'>Your message was submitted successfully!</p>
                }
                {loading && <p>Uploading and compressing the image please wait...</p>}
            </form>
            <NavLink to=".." relative="path" className="btn">
                Cancel
            </NavLink>
        </div>
  )
}
