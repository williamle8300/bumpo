import React, {Component} from 'react'
import Swipeable from 'react-swipeable'


class TodoItem extends Component {

  constructor(props) {

    super(props)
    this.state = {
      deltaX: 0
    }
    this.handleSwipeRight = this.handleSwipeRight.bind(this)
    this.handleSwipeLeft = this.handleSwipeLeft.bind(this)
    this.handleSwipeEnd = this.handleSwipeEnd.bind(this)
  }

  render() {
    return (
      <li style={this.styleA(this.props, this.state)}>
        <Swipeable
          onSwipingRight={this.handleSwipeRight}
          onSwipingLeft={this.handleSwipeLeft}
          onSwiped={this.handleSwipeEnd}
          onTouchTap={this.props.handleBump}
          trackMouse={true}
          style={this.styleC()}
        >
          {this.props.todo.text}
          <div style={this.styleB()}>
            {this.props.todo.score}
          </div>
        </Swipeable>
      </li>
    )
  }

  x(a, b) {
    console.log(1, a, b)
  }

  handleSwipeRight(e, deltaX) {

    this.setState({deltaX: deltaX > 100 ? 100 : deltaX})
  }

  handleSwipeLeft(e, deltaX) {

    this.setState({deltaX: -deltaX < -100 ? -100 : -deltaX})
  }

  handleSwipeEnd(e, data) {

    this.setState({deltaX: 0})
  }

  styleA(props, state) {
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',           //-100 <--> 100
      backgroundColor: `rgba(0, 0, 255, ${Math.abs(state.deltaX) / 100})`,
      fontFamily: 'helvetica',
      fontSize: '1.25rem',
      color: '#ffffff',
      // borderBottomWidth: 1,
      // borderBottomColor: '#ffffff',
      // borderBottomStyle: 'solid',
      cursor: 'pointer',
    }
  }

  styleB() {
     return {
       display: 'flex',
       justifyContent: 'center',
       alignItems: 'center',
       padding: '1rem',
       height: 20,
       width: 20,
       backgroundColor: '#bbbbbb',
       borderRadius: 100,
       fontSize: '1rem',
       fontWeight: 'bold',
     }
  }

  styleC() {
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '1rem',
      paddingRight: '1rem',
      paddingBottom: '1rem',
      paddingLeft: '1rem',
      width: '100%',
      backgroundColor: '#ccc',
      transform: `translateX(${this.state.deltaX}px)`,
      //
      // // TODO: this hack lets the Browser tap emulator work
      // //       overwrites react-draggable
      // touchAction: 'inherit',
    }
  }
}

export default TodoItem
