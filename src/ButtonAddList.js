import Firebase from './Firebase'
import React, {Component} from 'react'


class ButtonAddList extends Component {

  constructor(props) {

    super(props)
    this.state = {
      isInputVisible: false,
      name: '',
    }
    this._inputRef = null
    this._animationTime = 200
    this.toggleInput = this.toggleInput.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleAddList = this.handleAddList.bind(this)
  }

  render() {
    return (
      <div onTouchTap={this.toggleInput} style={this.styleB(this.props, this.state)}>
        {/* "action" makes iOS show the "GO" button on the keyboard*/}
        <form action onSubmit={this.handleAddList} style={this.styleA(this.props, this.state)}>
          <input
            ref={(element) => {this._inputRef = element}}
            value={this.state.name}
            onChange={this.handleInput}
            onBlur={() => document.activeElement.blur()}
          />
        </form>
        <div style={this.styleC(this.props, this.state)}>
          ADD LIST
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

    this.setState({name: e.target.value})
  }

  handleAddList (e) {

    e.preventDefault()

    const id = Firebase.database().ref('user_lists/' +Firebase.auth().currentUser.uid).push().key


    Firebase.database().ref('user_lists/' +Firebase.auth().currentUser.uid+ '/' +id)
    .set({
      id: id,
      name: this.state.name,
    }, (error) => {

      if (error) alert(error)

      this.setState({
        isInputVisible: false,
        name: '',
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
      backgroundColor: 'green',
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

export default ButtonAddList
