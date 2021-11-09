import React,{useState, useContext, useEffect, createRef } from "react";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { storage,db } from '../firebase';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';
import '../css/ImageUpload.css';
import axios from '../axios';
import UserContext from '../user';
import { lastPhotoId } from '../services/firebase';


function Modal({ setOpenModal }) {
    const {
        user: { uid: userId = ' ' }
    } = useContext(UserContext);
    const [caption, setCaption] = useState("");
    const [comments,setComments] = useState([]);
    const [url, setUrl] = useState("");
    const [image, setImage] = useState("");
    const [likes,setLikes] = useState([]);
    const [progress, setProgress] = useState(0);
    const [maxPhotoId, setMaxPhotoId] = useState(null);
    let outputImage = createRef();

    useEffect (() => {
        async function getLastPhotoId() {
            let lastId=0
            const lastPhoto = await lastPhotoId();
            lastId = lastPhoto[0].photoId;
            setMaxPhotoId(lastId);
        }
       getLastPhotoId();
    },[]);

    const handleChange = (e) => {
        if(e.target.files[0]) {
            outputImage.current.src = URL.createObjectURL(e.target.files[0]);
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
                            comments : comments,
                            dateCreated : Date.now(),
                            imageSrc : url,
                            likes : likes,
                            photoId : maxPhotoId+1,
                            userId: userId,
                            userLatitude : "40.7128°",
                            userLongitude : "74.0060°",
                        })
                        db.collection("photos").add({
                            caption: caption,
                            comments : comments,
                            dateCreated : Date.now(),
                            imageSrc : url,
                            likes : likes,
                            photoId : maxPhotoId+1,
                            userId: userId,
                            userLatitude : "40.7128°",
                            userLongitude : "74.0060°",
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                        setOpenModal(false);
                    });
            }
        )
    }

    return (
        <>
        <div
        className="overflow-y-auto justify-center items-center flex overflow-x-hidden fixed inset-0 z-50 outline-none focus:outline-none"
        >
        <div className="overflow-y-auto relative w-full my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="overflow-y-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="overflow-y-auto flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                <h3 className="text-3xl font-semibold">
                New Post
                </h3>
                <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setOpenModal(false)}
                >
                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                </span>
                </button>
            </div>
            {/*body*/}
            <progress className="imageupload_progress h-1 mb-5" value={progress} max="100" />
            <section class=" overflow-auto p-8 w-full h-full flex flex-col">
            <header class="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
              {/* <input id="hidden-input" type="file" multiple class="hidden" /> */}
              <p class="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
              Upload a Photo
              </p>
              <button id="button" class="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none">
                <input type="file" onChange={handleChange} className="cursor-pointer"/>
              </button>
            </header>
            <div className="w-210 mt-5 flex flex-col h-40 sm:w-40 max-w-xs overflow-hidden rounded-lg  border-2 border-solid border-blue-300 shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300 ease-in-out">
            <img ref={outputImage} className="rounded w-40 h-40 object-cover object-center" src=""  alt="Image to Upload"/>
            </div>

            </section>

            <TextareaAutosize
                onChange={event => setCaption(event.target.value)} 
                value={caption} 
                color="yellow"
                size="regular"
                className="m-4 p-2"
                outline={true}
                placeholder="Add a Caption"
            />
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setOpenModal(false)}
                >
                Close
                </button>
                <button id="submit"
                className="bg-blue-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={handleUpload}
                >
                Upload
                </button>
            </div>
            </div>
        </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
    );
}

export default Modal;
