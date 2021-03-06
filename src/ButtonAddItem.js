import Firebase from './Firebase'
import React, {Component} from 'react'


class ButtonAddItem extends Component {

  constructor(props) {

    super(props)
    this.state = {
      touchElapsedTime: 0,
      isInputVisible: false,
      text: '',
    }
    this._inputRef = null
    this._touchElapsedThreshold = 100
    this._animationTime = 300
    this.showAddTodoInput = this.showAddTodoInput.bind(this)
    this.handleInput = this.handleInput.bind(this)
    this.handleAddItem = this.handleAddItem.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
  }

  render() {
    return (
      // FIXME: "OnClick" is a hack to remove iOS' magnifying glass for long taps
      <div onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} onClick={() => null} style={this.styleB(this.props, this.state)}>
        {/* "action" makes iOS display "GO" button on keyboard*/}
        <form action onSubmit={this.handleAddItem} style={this.styleA(this.props, this.state)}>
          <input
            ref={(element) => {this._inputRef = element}}
            value={this.state.text}
            onChange={this.handleInput}
          />
          <button onTouchTap={() => this.setState({isInputVisible: false})}>CLOSE</button>
        </form>
        <div style={this.styleC(this.props, this.state)}>
          ADD TODO
        </div>
      </div>
    )
  }

  // FIXME: impure function: side-effects
  handleTouchStart() {

    this._timerIncrementer = setInterval(() => {

      if (this.state.touchElapsedTime > this._touchElapsedThreshold) {

        this.setState({touchElapsedTime: 0}, () => {

          clearInterval(this._timerIncrementer)
          this.props.toggleBulkEditor()
        })
      }
      else this.setState({touchElapsedTime: this.state.touchElapsedTime + 1})
    }, 1)
  }

  // FIXME: impure function: side-effects
  handleTouchEnd() {

    if (this.state.touchElapsedTime < this._touchElapsedThreshold) {

      this.showAddTodoInput()
    }

    this.setState({touchElapsedTime: 0}, () => clearInterval(this._timerIncrementer))
  }

  showAddTodoInput() {

    this.setState({isInputVisible: true}, () => {

      // FIXME: "setTimeout" hack for iOS
      this._inputRef.focus()
    })
  }

  handleInput (e) {

    this.setState({text: e.target.value})
  }

  handleAddItem (e) {

    e.preventDefault()

    const id = Firebase.database().ref('user_items/' +Firebase.auth().currentUser.uid).push().key


    Firebase.database().ref('user_items/' +Firebase.auth().currentUser.uid+ '/' +id)
    .set({
      id: id,
      timestamp: Firebase.database.ServerValue.TIMESTAMP,
      lastUpdated: Firebase.database.ServerValue.TIMESTAMP,
      text: this.state.text,
      _list_: this.props._list_,
      isCompleted: false,
      score: 1,
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
      position: 'absolute',
      top: '90%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '10%',
      fontFamily: 'helvetica',
      backgroundColor: 'green',
      color: 'white',
      // transform: state.isInputVisible ? 'translate(-50%, 50%)' : 'none',
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
