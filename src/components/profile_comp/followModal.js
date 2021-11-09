import React,{useState,useEffect,useContext} from "react";
import { getProfiles } from '../../services/firebase'
import {DEFAULT_IMAGE_PATH} from '../../constants/path'
import { Link } from 'react-router-dom';
import useUser from "../../hooks/use-user";
import Skeleton from 'react-loading-skeleton';


function FollowModal({ setOpenModal,info,attrs }) {
    const [profiles,setProfiles] = useState(null);
    const {
        user: { docId, fullName, username, userId,following } 
    } = useUser();

    let test = [];
    Object.values(attrs).forEach((attr) => {
        test.push(attr);
    });

    useEffect(() => {
        async function getProfilesInfo() {
            if(attrs.length>0){
                const response = await getProfiles(test);
                setProfiles(response);
            }else{
                setProfiles(`You have no ${info} information`)
            }
        }

        getProfilesInfo()
    },[]);
    
    return (
        <>
        <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        >
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                <h3 className="text-3xl font-semibold">
                {info=="followers" ? "Your Followers" : "You are Following" }
                </h3>
                <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setOpenModal(false)}
                >
                <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                </span>
                </button>
            </div>
            {/*body*/}
            {
            !profiles ? (
                //10 lines loding skeleton
                <Skeleton count={1} height={150} className="mt-5" />
            ): attrs.length > 0 ? profiles.map((profile) => (
                <div className="flex flex-row items-center align-items justify-between m-2 overflow-y-auto modal-content">
                <div className="flex items-center justify-between">
                    <img
                    className="rounded-full w-8 flex mr-3"
                    src={profile.profile}
                    alt="user profile"
                    onError={(e) => {
                      e.target.src = DEFAULT_IMAGE_PATH;
                    }} />
                    <Link to={`/p/${profile.username}`}>
                        <p className="font-bold text-sm"
                        onClick={() => setOpenModal(false)}
                        >
                            {profile.username}
                        </p>
                    </Link>
                </div>
                </div>
            )) : 
                <p className="font-bold m-2">{profiles}</p>
            }
                              
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setOpenModal(false)}
                >
                Close
                </button>
            </div>
            </div>
        </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>

    );
}

export default FollowModal;
