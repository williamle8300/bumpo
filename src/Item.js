import Firebase from 'firebase'
import React, {Component} from 'react'
import Swipeable from 'react-swipeable'


class TodoItem extends Component {

  constructor(props) {

    super(props)
    this.state = {
      loading: false,
      x: 0,
    }
    this.handleSwipeRight = this.handleSwipeRight.bind(this)
    this.handleSwipeLeft = this.handleSwipeLeft.bind(this)
    this.handleSwipeComplete = this.handleSwipeComplete.bind(this)
    this.toggleComplete = this.toggleComplete.bind(this)
    this.delete = this.delete.bind(this)
  }

  render() {
    return (
      <li style={this.styleA(this.props, this.state)}>
        <Swipeable
          onSwipingRight={this.handleSwipeRight}
          onSwipingLeft={this.handleSwipeLeft}
          onSwiped={this.handleSwipeComplete}
          onTouchTap={this.props.handleBump}
          trackMouse={true}
          style={this.styleC(this.props, this.state)}
        >
          {this.props.item.text}
          <div style={this.styleB()}>
            {this.props.item.score}
          </div>
        </Swipeable>
      </li>
    )
  }

  handleSwipeRight(e, deltaX) {

    if (deltaX > 100) return

    this.setState({x: deltaX})
  }

  handleSwipeLeft(e, deltaX) {

    this.setState({x: -deltaX < -100 ? -100 : -deltaX})
  }

  handleSwipeComplete(e, x, y) {

    this.setState({x: 0}, () => {

      if (x < -100) this.toggleComplete()
      if (x > 100) this.delete()
    })

  }

  toggleComplete() {

    this.setState({loading: true}, () => {

      Firebase.database().ref('/user_items/' +Firebase.auth().currentUser.uid+ '/' +this.props.id)
      .set(Object.assign({}, this.props.item, {isCompleted: !this.props.item.isCompleted, lastUpdated: Firebase.database.ServerValue.TIMESTAMP}))
      .then((error) => {

        this.setState({loading: false}, () => error ? alert(error) : null)
      })
    })
  }

  delete() {

    this.setState({loading: true}, () => {

      Firebase.database().ref('/user_items/' +Firebase.auth().currentUser.uid+ '/' +this.props.id)
      .remove()
      .then((error) => error ? alert(error) : null)
    })
  }

  componentWillUnmount() {
    console.log('unmounting...', this.props.item.text)
  }

  styleA(props, state) {
    return {
      zIndex: props.isCurrentBumpItem ? 2 : 1,
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',           //-100 <--> 100
      width: '100%',
      height: '18%',
      backgroundColor: `rgba(0, 0, 255, ${Math.abs(state.x) / 100})`,
      fontFamily: 'helvetica',
      fontSize: '1.25rem',
      color: '#ffffff',
      // borderBottomWidth: 1,
      // borderBottomColor: '#ffffff',
      // borderBottomStyle: 'solid',
      cursor: 'pointer',
      transform: `translateY(${props.sortedItems.map((item) => item.id).indexOf(props.id) * 100}%)`,
      transition: `transform ${props.animationTime}ms ease-out`,
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

    const backgroundColor = this.props.item.isCompleted ? 'blue' : this.props.isGettingJumped ? '#6dc7c7' : '#ccc'

    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: '1rem',
      paddingLeft: '1rem',
      width: '100%',
      height: '100%',
      backgroundColor: backgroundColor,
      transform: `translateX(${state.x}px)`,
      // transition: 'all 300ms ease-out',
    }
  }
}

export default TodoItem
