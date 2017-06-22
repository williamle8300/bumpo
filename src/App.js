// import sampleData from './sampleData.js'
import List from './List'

import React, {Component} from 'react'
import Firebase from './Firebase'
import FirebaseUI from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'


class App extends Component {

  constructor(props) {

    super(props)
    this.state = {
      isLoggedIn: false,
    }
    this.handleSignIn = this.handleSignIn.bind(this)
  }

  render() {
    return (
      <div style={{display: 'flex', flexFlow: 'column', height: '100%'}}>
        {this.state.isLoggedIn ? <List/> : <div id="yo"/>}
      </div>
    )
  }

  componentDidMount() {

    Firebase.auth().onAuthStateChanged(
      (user) => user ? this.setState({isLoggedIn: true}) : null,
      console.error
    )

    const ui = new FirebaseUI.auth.AuthUI(Firebase.auth())

    ui.start(
      '#yo',
      {
        signInFlow: 'popup',
        signInSuccessUrl: '/',
        signInOptions: [
          Firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          Firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        tosUrl: '/',
      }
    )

  }

  handleSignIn() {

  }

  styleC() {
    return {
      paddingTop: '1rem',
      paddingRight: '1rem',
      paddingBottom: '1rem',
      paddingLeft: '1rem',
      backgroundColor: '#ccc',
      fontFamily: 'helvetica',
      fontSize: '1.25rem',
      color: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: '#ffffff',
      borderBottomStyle: 'solid',
      cursor: 'pointer',
    }
  }
}

export default App
