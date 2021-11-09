import { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { doesUsernameExist } from '../services/firebase';
import { auth, db, storage } from '../firebase';
import * as ROUTES from '../constants/routes';
import axios from '../axios';
import { DEFAULT_IMAGE_PATH } from '../constants/path';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';


export default function SignUp() {
  const history = useHistory();

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [url,setUrl] = useState("");
  const [image, setImage] = useState({name:"default.png"});
  const [progress, setProgress] = useState(0);
  const [bio, setBio] = useState('');

  const [error, setError] = useState('');
  const isInvalid = password === '' || emailAddress === '';

  const handleChange = (e) => {
    if(e.target.files[0]) {
        setImage(e.target.files[0]);
    }
  };


  const handleSignUp = async (event) => {
    event.preventDefault();
    const usernameExists = await doesUsernameExist(username);
    let uploadTask;
    if(image != "default.png"){
      uploadTask = storage.ref(`/profile_images/${image.name}`).put(image);
    }
    if (!usernameExists) {
      try {
        const createdUserResult = await auth
          .createUserWithEmailAndPassword(emailAddress, password);

          await createdUserResult.user.updateProfile({
          displayName: username
        });

        if(image.name=="default.png"){
          storage.ref('profile_images').child(image.name)
          .getDownloadURL()
          .then(url => {
              setImage(null);
              setUrl(url);
              db
              .collection('users')
              .add({
                userId: createdUserResult.user.uid,
                username: username.toLowerCase(),
                fullName,
                profile : url,
                emailAddress: emailAddress.toLowerCase(),
                following: ['OpfbXRUpTWUJD7bEJWantwkbUfv1'],
                followers: [],
                dateCreated: Date.now(),
                bio
              });              
              alert("Signed Up Successfully")   
              history.push(ROUTES.DASHBOARD)   
          });
        }else{
          uploadTask.on('state_changed', 
        (snapshot) => {
          //takes a snap shot of the process as it is happening
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes)*100
          );
          setProgress(progress);

        }, (err) => {
          //catches the errors
          console.log("error" + err)
        },
        () => {          
            // complete function ...
            storage.ref('profile_images').child(image.name)
                .getDownloadURL()
                .then(url => {
                    setImage(null);
                    setUrl(url);
                    db
                    .collection('users')
                    .add({
                      userId: createdUserResult.user.uid,
                      username: username.toLowerCase(),
                      fullName,
                      profile : url,
                      emailAddress: emailAddress.toLowerCase(),
                      following: ['OpfbXRUpTWUJD7bEJWantwkbUfv1'],
                      followers: [],
                      dateCreated: Date.now(),
                      bio,
                    });       
                    setProgress(0)       
                    alert("Signed Up Successfully")
                    history.push(ROUTES.DASHBOARD)
                });
            }
        )
       }
      } catch (error) {
        setFullName('');
        setEmailAddress('');
        setPassword('');
        setBio('');
        setError(error.message);
      }
    } else {
      setUsername('');
      setError('That username is already taken, please try another.');
    }
  };

  useEffect(() => {
    document.title = 'Sign Up - Instagram';
  }, []);

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen">
      <div className="flex w-3/5">
        <img src="/images/iphone-with-profile.jpg" alt="iPhone with Instagram app" />
      </div>
      <div className="flex flex-col w-2/5">
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
          <h1 className="flex justify-center w-full">
            <img src="/images/logo.png" alt="Instagram" className="mt-2 w-6/12 mb-4" />
          </h1>
          <progress className="imageupload_progress h-1 mb-5" value={progress} max="100" />

          {error && <p className="mb-4 text-xs text-red-500">{error}</p>}

          <form onSubmit={handleSignUp} method="POST">
            <input
              aria-label="Enter your username"
              type="text"
              placeholder="Username"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setUsername(target.value)}
              value={username}
            />
            <input
              aria-label="Enter your full name"
              type="text"
              placeholder="Full name"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setFullName(target.value)}
              value={fullName}
            />
            <input
              aria-label="Enter your email address"
              type="text"
              placeholder="Email address"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setEmailAddress(target.value)}
              value={emailAddress}
            />
            <input
              aria-label="Enter your password"
              type="password"
              placeholder="Password"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setPassword(target.value)}
              value={password}
            />
           <TextareaAutosize
            aria-label="Enter your bio"
            type="text"
            placeholder="Complete your bio"
            className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
            onChange={({target}) => setBio(target.value)}
            value={bio}
            />
            <input 
            aria-label="Enter your password" 
            type="file" 
            onChange={handleChange}
            className="cursor-pointer mt-1 mb-2"/>
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-800 text-white w-full rounded h-8 font-bold
            ${isInvalid && 'opacity-50'}`}
            >
              Sign Up
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
          <p className="text-sm">
            Have an account?{` `}
            <Link to={ROUTES.LOGIN} className="font-bold text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
