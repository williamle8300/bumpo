import List from './List'
import Login from './Login'


import React, {Component} from 'react'
import Firebase from './Firebase'


class App extends Component {

  constructor(props) {

    super(props)
    this.state = {
      isLoggedIn: false,
    }
  }

  render() {
    return (
      <div style={{display: 'flex', flexFlow: 'column', height: '100%'}}>
        {this.state.isLoggedIn ? <List/> : <Login/>}
      </div>
    )
  }

  componentDidMount() {

    Firebase.auth().onAuthStateChanged(
      (user) => user ? this.setState({isLoggedIn: true}) : null,
      console.error
    )
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
