import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './containers/Home'
import BrowseReview from './containers/BrowseReview'
import WriteReview from './containers/WriteReview'
import Signin from './containers/Signin'
import Signout from './containers/Signout'
import Signup from './containers/Signup'
import Activate from './containers/Activate'
import About from './containers/About'

function App() {

  return (
    <Router>
    <div className='container'>           
      <Header title='Book Reviewer' component={Header} />           
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/browse' component={BrowseReview} />       
        <Route path='/write' component={WriteReview} />          
        <Route path='/signin'>
          <Signin />
        </Route>      
        <Route path='/signup'>
          <Signup />
        </Route>         
        <Route path='/signout' component={Signout} />  
        <Route path='/activate' component={Activate} />   
        <Route path='/about' component={About} />
      </Switch>
      <Footer />    
    </div>
    </Router>    
  );
}

export default App;
