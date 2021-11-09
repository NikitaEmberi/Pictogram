import React from 'react'
import useUser from '../../hooks/use-user';
import User from './user';
import Suggestions from './suggestions';
import NotFollowing from './NotFollowing';

function Sidebar() {
    const {
        user: { docId, fullName, username, userId,following,followers,profile } 
    } = useUser();
    
    return (
        <div className="p-4">
          <User username={username} fullName={fullName} profile_pic={profile}/>
          <Suggestions userId={userId} following={following} loggedInUserDocId={docId} profile_pic={profile}/> 
          <NotFollowing userId={userId} following={following} loggedInUserDocId={docId} followers={followers} profile_pic={profile}/> 
        </div>
    )
}

export default Sidebar
