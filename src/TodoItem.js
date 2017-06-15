import React, {Component} from 'react'
import Swipeable from 'react-swipeable'


class TodoItem extends Component {

  constructor(props) {

    super(props)
    this.state = {
      x: 0
    }
  }

  render() {
    return (
      <li style={this.styleA(this.props, this.state)}>
        <Swipeable
          onSwipingRight={(e, deltaX) => this.setState({x: deltaX > 100 ? 100 : deltaX})}
          onSwipingLeft={(e, deltaX) => this.setState({x: -deltaX < -100 ? -100 : -deltaX})}
          onSwiped={() => this.setState({x: 0})}
          onTouchTap={this.props.handleBump}
          trackMouse={true}
          style={this.styleC(this.props, this.state)}
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

  styleA(props, state) {
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',           //-100 <--> 100
      backgroundColor: `rgba(0, 0, 255, ${Math.abs(state.x) / 100})`,
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

  styleC(props, state) {
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
      transform: `translateX(${state.x}px)`,
    }
  }
}

export default TodoItem
