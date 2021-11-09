import { async } from '@firebase/util';
import { db, FieldValue } from '../firebase';

export async function doesUsernameExist(username) {
  const result = await db
    .collection('users')
    .where('username', '==', username.toLowerCase())
    .get();

  return result.docs.length > 0;
}

//get user from the firestore where userId===userId(passed from the auth)
export async function getUserByUserId(userId) {
  const result = await db
                  .collection('users')
                  .where('userId','==',userId)
                  .get();
  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));
  return user;
}

export async function getSuggestedProfiles(userId, following) {
  let query = db.collection('users');

  if (following.length > 0) {
    query = query.where('userId', 'not-in', [...following, userId]);
  } else {
    query = query.where('userId', '!=', userId);
  }
  const result = await query.limit(10).get();

  const profiles = result.docs.map((user) => ({
    ...user.data(),
    docId: user.id
  }));

  return profiles;

}

export async function updateFollowedUserFollowers(followedUserId, followingUserId, isAlreadyFollowing) {
  let query = db.collection('users');
  //followedUserId : the user who just got followed by me
  //followingUserId: me following that "followedUserId"
  return query.doc(followedUserId).update({followers: isAlreadyFollowing ?
    FieldValue.arrayRemove(followingUserId)
    : FieldValue.arrayUnion(followingUserId)})
}

export async function updateLoggedInUserFollowing(loggedInUserDocId, profileId, isFollowingProfile){
  let query = db.collection('users');
  return query
  .doc(loggedInUserDocId)
  .update({following: isFollowingProfile ?
    FieldValue.arrayRemove(profileId)
    :FieldValue.arrayUnion(profileId)})
}

export async function getPhotos(userId, following) {
  const result = await db
                .collection('photos')
                .where('userId', 'in', following)
                .get();
  
  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId : photo.id
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if(photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }

      const user = await getUserByUserId(photo.userId);
      const { username } = user[0];

      return { username, ...photo, userLikedPhoto };
    })
  )
    return photosWithUserDetails;
}

export async function getUserByUsername(username) {
  const result = await db.collection('users').where('username','==',username).get();
  return result.docs.map((item) => ({
    ...item.data(),
    docId:item.id
  }));

}

export async function getUserPhotosByUserId(userId) {
  const result = await db
    .collection('photos')
    .where('userId', '==', userId)
    .get();

  const photos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id
  }));
  return photos;
}

export async function isUserFollowingProfile(loggedInUsername, profileUserId){
  const result = db
    .collection('users')
    .where('username','==',loggedInUsername)
    .where('following','array-contains',profileUserId)
    .get()

    const [response={}] = (await result).docs.map((item) => ({
      ...item.data(),
      docId:item.id
    }));

    return response.userId;


} 

export async function toggleFollow(
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserId
) {
  // 1st param: karl's doc id
  // 2nd param: raphael's user id
  // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
  await updateLoggedInUserFollowing(activeUserDocId, profileUserId, isFollowingProfile);

  // 1st param: karl's user id
  // 2nd param: raphael's doc id
  // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
  await updateFollowedUserFollowers(profileDocId, followingUserId, isFollowingProfile);
}

export async function lastPhotoId(){
  let query = db.collection('photos');
  const result = await query.orderBy('photoId','desc').limit(1).get();

  const p = result.docs.map((pt) => ({
    ...pt.data(),
    pid: pt.id
  }))

  // return p[0].photoId
  return p
}

export async function getProfiles(attrs){
  let query = await db.collection('users').where('userId','in',attrs).get();

  const profiles = query.docs.map((user) => ({
    ...user.data(),
    docId: user.id
  }));

  return profiles;
}
