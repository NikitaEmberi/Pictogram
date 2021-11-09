import React, { useState, useEffect, useContext} from 'react';
import UserContext from '../user';
import { getUserByUserId , getPhotos } from '../services/firebase';

function usePhotos() {
    const [photos, setPhotos ] = useState(null);
    const {
        user: { uid: userId = ' ' }
    } = useContext(UserContext);

    useEffect (() => {
        async function getTimeLinePhotos() {
            const LoggedinUserDetails = await getUserByUserId(userId);
            let followedUserPhotos = [];
            // does the user actually follow people
            if(LoggedinUserDetails[0].following.length > 0) {
                followedUserPhotos = await getPhotos(userId, LoggedinUserDetails[0].following);
            }
            followedUserPhotos.sort((a,b) => b.dateCreared - a.dateCreared)
            setPhotos(followedUserPhotos);
        }
        getTimeLinePhotos();
    },[userId]);

    return { photos };
}

export default usePhotos
