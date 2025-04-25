import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * HOC that wraps a component with authentication. If the user is not
 * authenticated, the HOC will redirect the user to the login page.
 *
 * @param {React.ComponentType} Component - The component to wrap.
 * @returns {React.ComponentType} - The wrapped component.
 */
const withAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    const isAuthenticated = useSelector((state) => !!state.session.token);

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return <Component {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;

  return AuthenticatedComponent;
};

export default withAuth;
