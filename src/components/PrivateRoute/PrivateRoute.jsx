import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ path, component: Component }) => {
    return (
        <Route path={path} render={props => {
            if (localStorage.getItem('logged')) {
                return <Component {...props} />
            } else {
                return <Redirect to='/login' />
            }
        }}>
        </Route>
    )
}

export default PrivateRoute
