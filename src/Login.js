// FIXME: using refs for values instead of "state"
// ..ref.email1 ..ref.email2 ETC


import Firebase from './Firebase'
import React, {Component} from 'react'


class Login extends Component {

  constructor(props) {

    super(props)
    this.state = {
    }
    // this._inputRef = null
    // this._animationTime = 300
    this.handleSignUp = this.handleSignUp.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
    // this.handleAddItem = this.handleAddItem.bind(this)
  }

  render() {
    return (
      <div>
        <form action onSubmit={this.handleSignUp}>
          <input type="email" ref='email1' />
          <input type="password" ref='password1' />
          <button>Signup</button>
        </form>
        <form action onSubmit={this.handleSignIn}>
          <input type="email" ref='email2' />
          <input type="password" ref='password2' />
          <button>Signin</button>
        </form>
      </div>
    )
  }

  handleSignUp(event) {

    event.preventDefault()

    Firebase.auth()
    .createUserWithEmailAndPassword(this.refs.email1.value, this.refs.password1.value)
    .then((user) => {

      Firebase.database().ref('users/' + user.uid).set({
        email: user.email,
        uid: user.uid,
      })
    })
    .catch(alert)
}

  handleSignIn(event) {

    event.preventDefault()

    Firebase.auth()
    .signInWithEmailAndPassword(this.refs.email2.value, this.refs.password2.value)
    .then((user) => {
      console.log(user, 'signed in user')
    })
    .catch(alert)
  }
}

export default Login
