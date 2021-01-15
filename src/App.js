import { useState, useEffect } from 'react';
import { makeStyles, AppBar, Toolbar, Button } from '@material-ui/core';
import { Switch, Route, Link, Redirect } from "react-router-dom";
import './App.css';
import 'fontsource-roboto';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import About from './components/About/About';
import Users from './components/Users/Users';
import UserDetails from './components/UserDetails/UserDetails';
import NotFound from './components/NotFound/NotFound';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  }
}))
function App() {
  const classes = useStyles(),
    [loginData, setLoginData] = useState({
      email: '', password: ''
    }),
    [data, setData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    }),
    [logged, setLogged] = useState(localStorage.getItem('logged')),
    [name, setName] = useState((JSON.parse((localStorage.getItem('loggedAccount'))) &&
      JSON.parse(localStorage.getItem('loggedAccount')).firstName) || ''),

    onSubmit = (e) => {
      e.preventDefault()
      const inputs = Object.keys(e.target)
        .filter(key => e.target[key].tagName === 'INPUT')
        .map(key => e.target[key]),
        savedData = JSON.parse(localStorage.getItem('userData'))
      for (const input of inputs) {
        setLogged(true)
        if (!data[input.name]) {
          setLogged(false)
          alert(`Please enter all required fields`)
          document.getElementById([input.name]).focus()
          break
        }
      }
      if (savedData) {
        for (let i = 0; i < savedData.length; i++) {
          if (data.email === savedData[i].email) {
            alert('Already registered on this email');
            document.getElementById('email').focus();
            setLogged(false)
            break
          }
        }

      }
    },
    onLogin = (e) => {
      e.preventDefault()
      const inputs = Object.keys(e.target)
        .filter(key => e.target[key].tagName === 'INPUT')
        .map(key => e.target[key]),
        savedData = JSON.parse(localStorage.getItem('userData'))
      setLogged(true)
      for (const input of inputs) {
        if (!loginData[input.name]) {
          setLogged(false)
          alert(`Please enter your ${[input.name]}`)
          document.getElementById([input.name]).focus()
          return false
        }
      }
      if (savedData) {
        let logIn = false;
        for (let i = 0; i < savedData.length; i++) {
          if (loginData.email === savedData[i].email &&
            loginData.password === savedData[i].password) {
            logIn = true;
            localStorage.setItem('loggedAccount', JSON.stringify(savedData[i]))
            setName(savedData[i].firstName)
            alert('You are logged in');
            break
          }
        }
        if (!logIn) {
          alert('Incorrect email or password');
          setLogged(false)
          document.getElementById('email').focus()
          return false;
        }
      }
      else {
        alert('Incorrect email or password');
        setLogged(false)
        document.getElementById('email').focus()
        return false;
      }
    }
    ,
    onChange = (e) => {
      const { name, value } = e.target
      setData(preVal => {
        return {
          ...preVal,
          [name]: value,
        }
      })
    },
    onChangeLogin = (e) => {
      const { name, value } = e.target
      setLoginData(preVal => {
        return {
          ...preVal,
          [name]: value,
        }
      })
    }
  useEffect(() => {
    if (logged && data.firstName) {
      alert('You have created an account!')
      const accounts = JSON.parse(localStorage.getItem('userData')) || []
      accounts.push(data)
      localStorage.setItem('logged', 'true')
      localStorage.setItem('userData', JSON.stringify(accounts))
      localStorage.setItem('loggedAccount', JSON.stringify(data))
      setName(data.firstName)
      setData({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      })
    } else if (logged && loginData.email) {
      localStorage.setItem('logged', 'true')
      setLoginData({
        email: '', password: ''
      })
    }
  }, [logged]
  )

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit">
            <Link className='btns' to='/'>
              HOME
                          </Link>
          </Button>
          <Button color="inherit">
            <Link className='btns' to='/about'>
              ABOUT
                           </Link>
          </Button>
          <Button color="inherit">
            <Link className='btns' to='/users'>
              Users
                          </Link>
          </Button>
          {!logged ?
            <>
              <Button color="inherit">
                <Link className='btns' to='/signup'>
                  Sign Up
                                  </Link>
              </Button>
              <Button color="inherit">
                <Link className='btns' to='/login'>
                  Log in
                                  </Link>
              </Button>
            </> :
            <Button color="inherit"
              onClick={() => {
                setLogged(false)
                setName('')
                localStorage.removeItem('logged')
                localStorage.removeItem('loggedAccount')
              }}>Log out
                          </Button>}
          {logged ?
            <Button id='name' disabled>{name}'s account</Button>
            : null}</Toolbar>
      </AppBar>
      <Switch>
        <Route exact path='/'><Home name={name} /></Route>
        <PrivateRoute path='/about' component={About} />
        <PrivateRoute exact path='/users' component={Users} />
        <PrivateRoute path='/users/:userId/:userName' component={UserDetails} />
        <Route path='/signup'>
          {!logged ? <Signup data={data} onChange={onChange} onSubmit={onSubmit} />
            : <Redirect to='/' />}</Route>
        <Route path='/login' >
          {!logged ? <Login data={loginData} onChange={onChangeLogin} onSubmit={onLogin} />
            : <Redirect to='/' />}</Route>
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
