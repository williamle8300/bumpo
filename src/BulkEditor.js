// import Firebase from './Firebase'
import React, {Component} from 'react'


class BulkEditor extends Component {

  constructor(props) {

    super(props)
    this.state = {
    }
    this.handleInput = this.handleInput.bind(this)
  }

  render () {
    return (
      <div style={this.styleD(this.props, this.state)} ref={(element) => this._formRef = element}>
        <form action onSubmit={console.log}>
          <textarea
            ref={(element) => {this._textareaRef = element}}
            value={this.state.text}
            onChange={this.handleInput}
          />
        </form>
        <button onTouchTap={this.props.toggleBulkEditor}>CLOSE</button>
      </div>
    )
  }

  handleInput (e) {

    this.setState({text: e.target.value})
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.props.isVisible) this._textareaRef.focus()

    // Hack for Mobile Safari to manually hide keyboard
    if (!this.props.isVisible) document.activeElement.blur()
  }

  styleD(props, state) {
    return {
      zIndex: 1,
      position: 'fixed',
      top: '-100%',
      left: 0,
      display: 'flex',
      width: '100%',
      height: '100%',
      background: 'green',
      transform: props.isVisible ? 'translate(0, 100%)' : 'none',
      transition: 'all 300ms ease-out',
    }
  }
}

export default BulkEditor