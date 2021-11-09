import React,{useContext} from 'react'
import Skeleton from 'react-loading-skeleton';
import usePhotos from '../hooks/use-photos';
import Post from './post/';

function Timeline() {
    const { photos } = usePhotos()
    // we need to get logged in user's photos
    //on loading the photos, we need to use react skeleton
    // if we we have photos, render them (create a post component)
    // if the user has no photos, tell them to create some photos
    return (
        <div className="container col-span-2">
            {!photos ? (
                <>
                    <Skeleton count={4} width={640} height={500} />
                </>
            ) : photos?.length > 0 ? (
                photos.map((content) => <Post key={content.docId} content={content}></Post>)
            ): (
                <p className="text-center text-2xl">Follow people to see Posts</p>
            )}
        </div>
    )
}

export default Timeline
