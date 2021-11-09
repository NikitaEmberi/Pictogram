import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import * as ROUTES from '../constants/routes';

export default function IsUserLoggedin({ user, loggedInPath, children,...rest}){
    return (
        <Route
            {...rest}
            render={({ location }) => {
                if (!user) {
                return React.cloneElement(children, { user });
                }

                if (user) {
                return (
                    <Redirect
                    to={{
                        pathname: loggedInPath,
                        state: { from: location }
                    }}
                    />
                );
                }

                return null;
            }}
        />
    )
}

IsUserLoggedin.propTypes = {
    user: PropTypes.object,
    loggedInPath:PropTypes.string.isRequired,
    children: PropTypes.object.isRequired
};
