import Item from './Item'
import ButtonAddItem from './ButtonAddItem'


import React, {Component} from 'react'
import Firebase from './Firebase'
import FirebaseUI from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'


class List extends Component {

  constructor(props) {

    super(props)
    this.state = {
      items: [],
    }
    this.handleBump = this.handleBump.bind(this)
  }


  render () {

    const totalScore = this.state.items.map((item) => item.score).reduce((a, b) => a + b, 0)


    return (
      <div>
        <div style={this.styleA()}>{totalScore}</div>
        <ul style={this.styleB()}>
          {
            this.state.items
            .sort((a, b) => b.score - a.score)
            .map((item, index) => {
              return (
                <Item
                  key={item.timestamp}
                  handleBump={this.handleBump.bind(null, item.id)}
                  item={item}
                />
              )
            })
          }
        </ul>
        <ButtonAddItem/>
      </div>
    )
  }

  componentDidMount() {

    Firebase.database()
    .ref('/user_items/' +Firebase.auth().currentUser.uid+ '/items')
    .on('child_added', (snapshot) => {
      this.setState({items: this.state.items.concat(snapshot.val())})
      console.log(snapshot.val())
    })
  }

  handleBump (id) {

    const currentTodos = JSON.parse(localStorage.getItem('items'))
    const stagedTodo = currentTodos.filter((item) => item.id === id ? item : false)[0]
    const unstagedTodos = currentTodos.filter((item) => item.id !== id ? item : false)
    const updatedTodos = unstagedTodos.concat(Object.assign({}, stagedTodo, {score: stagedTodo.score + 1}))

    localStorage.setItem('items', JSON.stringify(updatedTodos))

    this.setState({items: updatedTodos})
  }

  styleA() {
    return {
      display : 'flex',
      flex: '0 1 10vh',
      justifyContent : 'center',
      alignItems : 'center',
      padding: '1rem',
      fontFamily: 'helvetica',
      fontSize: '2rem',
      color: '#ffffff',
      backgroundColor: '#bbbbbb',
    }
  }

  styleB() {
    return {
      flex: '1 1 auto',
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      height: '100%',
      overflowY: 'scroll',
      overflowX: 'hidden',
      listStyle: 'none',
      overflowScrolling: 'touch',
      WebkitOverflowScrolling: 'touch',
    }
  }
}

export default List
