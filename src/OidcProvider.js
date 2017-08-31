import PropTypes from 'prop-types';
import React from 'react';
import { userExpired, userFound, silentRenewError, sessionTerminated, userExpiring, userSignedOut } from './actions';

export const OidcContextType = {
  register: PropTypes.func.isRequired,
  unregister: PropTypes.func.isRequired
};

class OidcProvider extends React.Component {
  static propTypes = {
    userManager: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  };

  static childContextTypes = OidcContextType;

  constructor(props) {
    super(props);
    this.userManager = props.userManager;
    this.components = {};
    this.userLoggedIn = false;
  }

  componentWillMount() {
    // register the event callbacks
    this.userManager.events.addUserLoaded(this.onUserLoaded);
    this.userManager.events.addSilentRenewError(this.onSilentRenewError);
    this.userManager.events.addAccessTokenExpired(this.onAccessTokenExpired);
    this.userManager.events.addAccessTokenExpiring(this.onAccessTokenExpiring);
    this.userManager.events.addUserUnloaded(this.onUserUnloaded);
    this.userManager.events.addUserSignedOut(this.onUserSignedOut);
  }

  componentWillUnmount() {
    // unregister the event callbacks
    this.userManager.events.removeUserLoaded(this.onUserLoaded);
    this.userManager.events.removeSilentRenewError(this.onSilentRenewError);
    this.userManager.events.removeAccessTokenExpired(this.onAccessTokenExpired);
    this.userManager.events.removeAccessTokenExpiring(this.onAccessTokenExpiring);
    this.userManager.events.removeUserUnloaded(this.onUserUnloaded);
    this.userManager.events.removeUserSignedOut(this.onUserSignedOut);
  }

  // event callback when the user has been loaded (on silent renew or redirect)
  onUserLoaded = (user) => {
    this.props.store.dispatch(userFound(user));
    this.userLoggedIn = true;
    Object.keys(this.components).forEach(key => {
      const component = this.components[key];
      component&&component.userLoggedIn&&component.userLoggedIn();
    });
  };

  // event callback when silent renew errored
  onSilentRenewError = (error) => {
    this.props.store.dispatch(silentRenewError(error));
  };

  // event callback when the access token expired
  onAccessTokenExpired = () => {
    this.props.store.dispatch(userExpired());
  };

  // event callback when the user is logged out
  onUserUnloaded = () => {
    this.props.store.dispatch(sessionTerminated());
  };

  // event callback when the user is expiring
  onAccessTokenExpiring = () => {
    this.props.store.dispatch(userExpiring());
  }

  // event callback when the user is signed out
  onUserSignedOut = () => {
    this.props.store.dispatch(userSignedOut());
  }

  register(component) {
    if (component && component.oidcComponentId) {
      this.components[component.oidcComponentId] = component;
      if(this.userLoggedIn){
        component&&component.userLoggedIn&&component.userLoggedIn();
      }
    }
  };

  unregister(component) {
    delete this.components[component.oidcComponentId];
  };

  render() {
    return React.Children.only(this.props.children);
  }
}

export default OidcProvider;
