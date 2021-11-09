import './App.css';
import { lazy, Suspense } from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import React, { useState,useEffect } from 'react';
import useAuthListener from './hooks/use-auth-listener';
import UserContext from './user';
import ProtectedRoute from './helpers/protected_route';
import IsUserLoggedIn from './helpers/is-user-logged-in';

const Login = lazy(() => import('./components/Login'));
const SignUp = lazy(() => import('./components/sign-up'));
const NotFound = lazy(() => import('./components/not-found'));
const Dashboard = lazy(() => import('./components/dashboard'));
const Profile = lazy(() => import('./components/profile'));

function App() {
  const { user } = useAuthListener();


  return (    
    <div className="App">
      <UserContext.Provider value={{ user }}>
        <Router>
          <Suspense fallback={<p>Loading...</p>}>
            <Switch>
              <IsUserLoggedIn user={user} loggedInPath={ROUTES.DASHBOARD} path={ROUTES.LOGIN}>
                <Login />
              </IsUserLoggedIn>
              <Route path={ROUTES.SIGN_UP} component={SignUp} />
              <Route path={ROUTES.PROFILE} component={Profile} />
              <ProtectedRoute user={user} path={ROUTES.DASHBOARD} exact>
                <Dashboard />
              </ProtectedRoute>
              <Route path={ROUTES.NOT_FOUND} component={NotFound} />
            </Switch>
          </Suspense>    
        </Router>
      </UserContext.Provider>


      {/* Posts */}
      {/* <div className="app_posts">
        {
          posts.map((post) => (
            // console.log(id)
            <Post key={post._id} postId={post._id} user={user} username={post.user} caption={post.caption} imageUrl={post.image} />
          ))
        }
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
       ) : (
        <h3>Sorry you need to login to upload</h3>
       )
      }
 */}
    </div>

  );
}

export default App;
