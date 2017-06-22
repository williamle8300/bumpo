// https://stackoverflow.com/questions/42573017/in-react-es6-why-does-the-input-field-lose-focus-after-typing-a-character

import Firebase from './Firebase'


import React, {Component} from 'react'


class ButtonAddItem extends Component {

  constructor(props) {

    super(props)
    this.state = {
      isInputVisible: false,
      text: '',
    }
    this._inputRef = null
    this._animationTime = 300
    this.toggleInput = this.toggleInput.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleAddItem = this.handleAddItem.bind(this)
  }

  render() {
    return (
      <div onTouchTap={this.toggleInput} style={this.styleB(this.props, this.state)}>
        {/* "action" makes iOS show the "GO" button on the keyboard*/}
        <form action onSubmit={this.handleAddItem} style={this.styleA(this.props, this.state)}>
          <input
            ref={(element) => {this._inputRef = element}}
            value={this.state.text}
            onChange={this.handleInput}
          />
        </form>
        <div style={this.styleC(this.props, this.state)}>
          ADD TODO
        </div>
      </div>
    )
  }

  toggleInput () {

    this.setState({isInputVisible: !this.state.isInputVisible}, () => {

      setTimeout(() => this._inputRef.focus(), this._animationTime)
    })
  }

  handleInput (e) {

    this.setState({text: e.target.value})
  }

  handleAddItem (e) {

    e.preventDefault()

    const id = Firebase.database().ref('user_items/' +Firebase.auth().currentUser.uid+ '/items').push().key


    Firebase.database().ref('user_items/' +Firebase.auth().currentUser.uid+ '/items/' +id)
    .set({
      id: id,
      lastUpdated: Firebase.database.ServerValue.TIMESTAMP,
      text: this.state.text,
      _list_: 'LIST_A',
      isCompleted: false,
      score: 0,
    }, (error) => {

      if (error) alert(error)

      this.setState({
        isInputVisible: false,
        text: '',
      })
    })
  }

  styleA(props, state) {
    return {
      display: state.isInputVisible ? 'flex' : 'none',
    }
  }

  styleB(props, state) {
    return {
      zIndex: 1,
      position: 'fixed',
      bottom: state.isInputVisible ? '50%' : 0,
      left: state.isInputVisible ? '50%' : 0,
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '1rem',
      paddingBottom: '1rem',
      width: state.isInputVisible ? '90%' : '100%',
      fontFamily: 'helvetica',
      backgroundColor: '#769276',
      color: 'white',
      transform: state.isInputVisible ? 'translate(-50%, 50%)' : 'none',
      transition: `all ${this._animationTime}ms ease-out`,
    }
  }

  styleC(props, state) {
    return {
      display: state.isInputVisible ? 'none' : 'flex',
    }
  }
}

export default ButtonAddItem
