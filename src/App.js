import sampleData from './sampleData.js'
import TodoItem from './TodoItem'


import React, {Component} from 'react'
import Swipeable from 'react-swipeable'


class App extends Component {

  constructor(props) {

    super(props)
    this.state = {
      todos: [],
      lastY: 0,
      y: 0,
    }
    this.onSwiping = this.onSwiping.bind(this)
    this.onSwiped = this.onSwiped.bind(this)
    this.handleBump = this.handleBump.bind(this)
  }

  render() {

    const totalScore = this.state.todos.map((todo) => todo.score).reduce((a, b) => a + b, 0)


    return (
      <div style={{padding: '1rem', height: '100%'}}>
        <div style={this.styleA()}>{totalScore}</div>
        <Swipeable
          onSwiping={this.onSwiping}
          onSwiped={this.onSwiped}
          trackMouse={true}
          style={this.styleD(this.props, this.state)}
        >
          <ul style={this.styleB()}>
            {
              this.state.todos
              .sort((a, b) => b.score - a.score)
              .map((todo, index) => {
                return (
                  <TodoItem
                    key={todo.id}
                    handleBump={this.handleBump.bind(null, todo.id)}
                    todo={todo}
                  />
                )
              })
            }
          </ul>
        </Swipeable>
        <button
          onTouchTap={() => {
            localStorage.removeItem('todos')
            window.location = '/'
          }}
          style={{zIndex: 1, position: 'fixed', bottom: '1rem', left: '1rem',}}>
          delete localstorage
        </button>
      </div>
    )
  }

  componentDidMount() {

    if (localStorage.getItem('todos')) return this.setState({todos: JSON.parse(localStorage.getItem('todos'))})

    localStorage.setItem('todos', JSON.stringify(sampleData))

    this.setState({todos: sampleData})
  }

  onSwiping (e, deltaX, deltaY) {


    this.setState({y: this.state.lastY - deltaY})
  }

  onSwiped (e, deltaX, deltaY) {

    console.log(this.state.lastY)
    this.setState({lastY: this.state.lastY - deltaY})
  }

  handleBump (id) {

    const currentTodos = JSON.parse(localStorage.getItem('todos'))
    const stagedTodo = currentTodos.filter((todo) => todo.id === id ? todo : false)[0]
    const unstagedTodos = currentTodos.filter((todo) => todo.id !== id ? todo : false)
    const updatedTodos = unstagedTodos.concat(Object.assign({}, stagedTodo, {score: stagedTodo.score + 1}))

    localStorage.setItem('todos', JSON.stringify(updatedTodos))

    this.setState({todos: updatedTodos})
  }

  styleA() {
    return {
      display : 'flex',
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
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      listStyle: 'none',
    }
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

  styleD(props, state) {
    return {
      transform: `translateY(${state.y}px)`
    }
  }
}

export default App
