import React, { useState } from 'react'
import { Button } from '@material-ui/core';
import { storage,db } from '../firebase.js';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';
import '../css/ImageUpload.css';
import axios from '../axios';

function ImageUpload({username}) {
    const [caption, setCaption] = useState("");
    const [url, setUrl] = useState("");
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes)*100
                );
                setProgress(progress);
            },
            (error) => {
                //error while uploading
                console.log(error);
                alert(error.message);
            },
            //when upload completes
            () => {
                // complete function ...
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {

                        setUrl(url);

                        axios.post('/upload', {
                            caption: caption,
                            user: username,
                            image: url,
                        })
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
            }
        )
    }

    return (
        <div className="imageUpload">
            <progress className="imageupload_progress" value={progress} max="100" />
            <input type="text" placeholder="Enter a Caption!" onChange={event => setCaption(event.target.value)} value={caption} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
