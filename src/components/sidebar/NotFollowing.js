import React,{useState, useEffect} from 'react'
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';
import { getProfiles } from '../../services/firebase';
import SuggestedProfile from './suggested-profile';

function NotFollowing({userId, following, loggedInUserDocId, followers, profile_pic }) {
    let uniqueUsers=[]
    if(!followers){
        <Skeleton count={1} height={150} className="mt-5" />
    }else{
        uniqueUsers = following.filter((o) => followers.indexOf(o) === -1);
    }

    // console.log(following);
    // console.log(followers)
    const [profiles, setProfiles] = useState(null);
    useEffect(() => {
        async function suggestedProfiles() {
            const response = await getProfiles(uniqueUsers);
            setProfiles(response);
        }

        if(userId) {
            suggestedProfiles();
        }

    }, [userId])
    return !profiles ? (
        //10 lines loding skeleton
        <Skeleton count={1} height={150} className="mt-5" />
    ): profiles.length > 0 ? (
        <div className="rounded flex flex-col mt-5">
            <div className="text-sm flex items-center align-items justify-between mb-2">
                <p className="font-bold text-gray">Users Who Don't follow You Back</p>
            </div>   
            <div className ='mt-4 h-30 grid gap-3 overflow-y-auto'>
                {/* {changeRender(false)} */}
                { 
                profiles.map((profile) => (
                    <SuggestedProfile
                        key={profile.docId}
                        spDocId={profile.docId}
                        username={profile.username}
                        profileId={profile.userId}
                        userId={userId}
                        loggedInUserDocId = {loggedInUserDocId}
                        info="not-following"
                        profile_pic={profile.profile}
                    />
                ))}
            </div>      
        </div>
    ): null;
}

export default NotFollowing;

NotFollowing.propTypes = {
    userId: PropTypes.string,
    following: PropTypes.array,
    loggedInUserDocId : PropTypes.string,
    followers : PropTypes.array
};
