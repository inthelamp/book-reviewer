import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './containers/Home'
// import ReviewDetail from './components/ReviewDetail'
import Signin from './containers/Signin'
import Signout  from './containers/Signout'
import Signup from './containers/Signup'
import Activate from './containers/Activate'
import About from './containers/About'
import './App.css'

function App() {
  return (    
    <Router>                
      <div className='container'>           
        <Header component={ Header } />    
        <div className='App-body'>   
          <Switch>
            <Route path='/' exact component={ Home } />          
            {/* <Route path='/review' component={ ReviewDetail } />                                   */}
            <Route path='/signin' component={ Signin } />
            <Route path='/signup'>
              <Signup />
            </Route>         
            <Route path='/signout' component={ Signout } />          
            <Route path='/activate' component={ Activate } />   
            <Route path='/about' component={ About } />
          </Switch>
        </div>
        <Footer />    
      </div>  
    </Router>     
  )
}

export default App;
