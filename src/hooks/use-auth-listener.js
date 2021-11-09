import {useState,useEffect,useContext} from 'react';
import { auth } from '../firebase';

function useAuthListener(){
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('authUser')));
    useEffect(() => {
        const listener = auth.onAuthStateChanged((authUser) => {
            // we have a user ... therefore we can store the user in localStorage\
            if(authUser) {
                localStorage.setItem('authUser', JSON.stringify(authUser));
                setUser(authUser);
            }else{
                //we don't have an authUser, therefore clear the localStorage
                localStorage.removeItem('authUser');
                setUser(null);
            }
        });

        return () => listener();
    }, [auth])

    return {user};
}

export default useAuthListener
