import React,{useState } from 'react'
import PropTypes, { func } from 'prop-types'
import {DEFAULT_IMAGE_PATH} from '../../constants/path'
import { Link } from 'react-router-dom';
// import useForceUpdate from 'use-force-update';
import { updateLoggedInUserFollowing,updateFollowedUserFollowers } from '../../services/firebase';

function SuggestedProfile({spDocId, username, profileId, userId, loggedInUserDocId, info, profile_pic }) {
    const [followed, setFollowed] = useState(false);
    const [doRender, setDoRender ] = useState(false);
     
        async function handleFollowUser() {
            setFollowed(true);
            if(info=="suggestions"){
                //update the following array of the logged in user 
                await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
                //update the followers array of the user who has been followed
                await updateFollowedUserFollowers(spDocId,userId, false);
                window.location.reload();
            }else{
                await updateLoggedInUserFollowing(loggedInUserDocId, profileId, true);
                await updateFollowedUserFollowers(spDocId,userId, true);
                window.location.reload();
            }
        }

  

    return !followed && !doRender ? (
        <div className="flex flex-row items-center align-items justify-between">
            <div className="flex items-center justify-between">
                <img
                className="rounded-full w-8 flex mr-3"
                src={profile_pic}
                alt="user profile"
                onError={(e) => {
                  e.target.src = DEFAULT_IMAGE_PATH;
                }} />
                <Link to={`/p/${username}`}>
                    <p className="font-bold text-sm">{username}</p>
                </Link>
            </div>
            <div>
                <button type="button"
                className='bg-blue-500 mr-3 text-sm rounded text-white p-1' 
                onClick={() => { handleFollowUser(); }}>
                    {info=="suggestions" ? "Follow" : "Unfollow"} 
                </button>
            </div>
        </div>
    ):null
    
}

export default SuggestedProfile

SuggestedProfile.propTypes = {
    spDocId: PropTypes.string.isRequired,
    username : PropTypes.string.isRequired,
    profileId : PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    loggedInUserDocId : PropTypes.string.isRequired
}
