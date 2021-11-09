import {useState,useEffect,useContext} from 'react';
import UserContext from '../user';
import { getUserByUserId } from '../services/firebase';

export default function useUser() {
    const [activeUser, setActiveUser] = useState({});
    const { user } = useContext(UserContext);

    useEffect(() => {
        async function getUserObjectByUserId() {
            // we need a function that we can call (firebase service)
            // that gets the user data based on the id
            const [response] = await getUserByUserId(user.uid);
            setActiveUser(response);
        }    
        if(user?.uid) {
            getUserObjectByUserId();
        }
    }, [user]);

    return { user: activeUser };
}
