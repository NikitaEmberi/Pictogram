import React,{useState, useEffect} from 'react'
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';
import { getSuggestedProfiles } from '../../services/firebase';
import SuggestedProfile from './suggested-profile';

function Suggestions({userId, following, loggedInUserDocId, profile_pic}) {
    const [profiles, setProfiles] = useState(null);
    useEffect(() => {
        async function suggestedProfiles() {
            const response = await getSuggestedProfiles(userId, following);
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
        <div className="rounded flex flex-col">
            <div className="text-sm flex items-center align-items justify-between mb-2">
                <p className="font-bold text-gray">Suggestions for you</p>
            </div>   
            <div className ='mt-4 h-30 grid gap-3 overflow-y-auto'>
                {profiles.map((profile) => (
                    <SuggestedProfile
                        key={profile.docId}
                        spDocId={profile.docId}
                        username={profile.username}
                        profileId={profile.userId}
                        userId={userId}
                        loggedInUserDocId = {loggedInUserDocId}
                        info="suggestions"
                        profile_pic = {profile.profile}
                        // loggedInUserDocId={loggedInUserDocId}
                    />
                ))}
            </div>      
        </div>
    ): null;
}

export default Suggestions;

Suggestions.propTypes = {
    userId: PropTypes.string,
    following: PropTypes.array,
    loggedInUserDocId : PropTypes.string
};
