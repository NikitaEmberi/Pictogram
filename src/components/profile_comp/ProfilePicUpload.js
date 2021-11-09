import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { db,storage } from "../../firebase";
import firebase from "firebase/compat/app";
import "./ImageUpload.css";
import axios from "../../axios.js";
import * as ROUTES from '../../constants/routes';
import { useHistory } from 'react-router-dom';


const ProfilePicUpload = ({ username, profileDocId, profileUserId }) => {
  const history = useHistory();
  const [url, setUrl] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0); //progress bar
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]); // take the first file chosen
    }
  };

  async function handleUpload() {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransfered / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
       storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setUrl(url);
            db.collection("users").doc(profileDocId).update({
              profile: url,
            });
            setProgress(0);
            setImage(null);
            alert("Image Uploaded")
            // history.push(ROUTES.DASHBOARD)   
        });
      }
    );
  };
  return (
    <div className="app__imageUpload">
    <form className="app__form">
        <h2><b>  Add a Profile Picture</b></h2>
       
        <br />
      <progress
        className="app__imageProgress"
        value={progress}
        max="100"
      />
      
      <br />         
      <input type="file" onChange={handleChange} />
      <Button class="upload__button" onClick={handleUpload}>
        Upload
      </Button>
    </form>
  </div>
  );
};

export default ProfilePicUpload;
