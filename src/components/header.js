import React, {useContext, useState} from 'react'
import UserContext from '../user'
import { auth, db } from '../firebase';
import * as ROUTES from '../constants/routes';
import { Link } from 'react-router-dom';
import { DEFAULT_IMAGE_PATH } from '../constants/path';
import Modal from './postUpload';
import useUser from '../hooks/use-user';

function Header() {
    const { user } = useContext(UserContext)
    const {
        user: { profile } 
    } = useUser();
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <header className="h-16 bg-white border-b border-gray-300 mb-8">
            <div className="container mx-auto max-w-screen-lg h-full">
                <div className="flex justify-between h-full">
                    <div className="text-gray-700 text-center flex items-center align-items cursor-pointer">
                        <h1 className="flex justify-center w-full">
                            <Link to={ROUTES.DASHBOARD}>
                                <img src="/images/logo.png" alt="Instagram" className="mt-2 w-6/12" />
                            </Link>

                        </h1>

                    </div>
                    <div className="text-gray-700 text-center flex items-center align-items">
                        {user ? (
                            <>
                                <Link to={ROUTES.DASHBOARD} aria-label="Dashboard"> 
                                <svg
                                className="w-8 mr-6 text-black-light cursor-pointer"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                >
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>                                
                                </Link>

                                {/* <Link to={ROUTES.DASHBOARD} aria-label="Upload">  */}
                                <button type="button" title="Upload" 
                                    onClick={() => {
                                        setModalOpen(true);
                                    }}
                                >
                                <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="w-8 mr-6 text-black-light cursor-pointer" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor">
                                    <path 
                                    stroke-linecap="round" stroke-linejoin="round" 
                                    stroke-width="2" 
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" 
                                    />
                                </svg> 
                                </button>  
                                {modalOpen && <Modal setOpenModal={setModalOpen} />}                           
                                {/* </Link> */}

                                <button type="button" title="Sign Out" onClick={() => auth.signOut()} onKeyDown={(event) => {
                                    if(event.key === 'Enter'){
                                        auth.signOut();
                                    }
                                }}>
                                    <svg
                                        className="w-8 mr-6 text-black-light cursor-pointer"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                </button>
                                <div className="flex items-center cursor-pointer">
                                    <Link to={`/p/${user.displayName}`}>
                                        <img
                                            className="rounded-full h-8 w-8 flex"
                                            src={profile}
                                            alt={`${user.displayName} profile`}
                                            onError={(e) => {
                                                e.target.src = DEFAULT_IMAGE_PATH;
                                            }}
                                        />
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to={ROUTES.LOGIN} >
                                    <button type="button" className="bg-blue-500 font-bold text-sm rounded text-white w-20 h-8">Log In</button>
                                </Link>
                                <Link to={ROUTES.SIGN_UP}>
                                    <button type="button"  className="font-bold text-sm rounded text-blue-500 w-20 h-8">Sign Up</button>
                                </Link>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </header>
    )
}

export default Header
