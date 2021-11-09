import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import {db,storage} from "../../firebase"
import firebase from "firebase/compat/app";
import "./ImageUpload.css";
import axios from "../../axios";

const BioUpload = ({ username, profileDocId, profileUserId }) => {
  const [bio, setBio] = useState("");
  const [progress, setProgress] = useState(0); //progress bar

  async function handleUpload() {
    await db.collection("users").doc(profileDocId).update({
      bio: bio,
    });
    setProgress(0);
    setBio("");
    alert("Bio Updated"); 
    window.location.reload();  
  };
  return (
    <div className="app__imageUpload">
      <form className="app__form">
          <h2><b><center>Personal Info</center></b></h2>
          <br></br>       
        <textarea
          placeholder="Enter your bio"
          class="image__caption"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
        />
        <Button class="upload__button" onClick={handleUpload} >
          Update
        </Button>
      </form>
    </div>
  );
};

export default BioUpload;
