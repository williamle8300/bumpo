import Item from './Item'
import ButtonAddItem from './ButtonAddItem'


import React, {Component} from 'react'
import Firebase from './Firebase'


class List extends Component {

  constructor(props) {

    super(props)
    this.state = {
      items: [],
    }
    this.handleBump = this.handleBump.bind(this)
  }

  render() {

    const totalScore = this.props.items.map((item) => item.score).reduce((a, b) => a + b, 0)


    return (
      <div style={{zIndex: 1, position: 'fixed', top: 0, width: '100%', height: '100%'}}>
        <div style={this.styleA()}>{totalScore}</div>
        <ul style={this.styleB()}>
          {
            this.props.items
            .sort((a, b) => b.score - a.score)
            .map((item, index) => {
              return <Item key={item.id} handleBump={this.handleBump.bind(null, item.id)} item={item}/>
            })
          }
        </ul>
        <ButtonAddItem _list_={this.props._list_}/>
      </div>
    )
  }

  // componentDidMount() {
  //
  // }
  handleBump (id) {

    const oldItem = this.props.items.filter((item) => item.id === id)[0]
    const newItem = Object.assign({}, oldItem, {score: oldItem.score + 1, lastUpdated: Firebase.database.ServerValue.TIMESTAMP})


    Firebase.database()
    .ref('/user_items/' +Firebase.auth().currentUser.uid+ '/' +id)
    .set(newItem)
    .then((error) => error ? alert(error) : null)
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
