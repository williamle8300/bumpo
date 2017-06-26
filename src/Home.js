import List from './List'
import ButtonAddList from './ButtonAddList'


import React, {Component} from 'react'
import Firebase from './Firebase'


class Home extends Component {

  constructor(props) {

    super(props)
    this.state = {
      isViewingList: false,
      currentListIDInView: null,
      touchElapsedTime: 0,
      lists: [],
      items: [],
    }
    this._touchElapsedThreshold = 100
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
    this.handleCloseList = this.handleCloseList.bind(this)
  }


  render () {
    return (
      <div style={{height: '100%'}}>


        {/*ALL LISTS*/}
        <div style={{display: 'flex', flexWrap: 'wrap', height: '100%', overflow: 'scroll'}}>
          {this.state.lists.map((list) => {
            return (
              <div
                key={list.id}
                onTouchStart={this.handleTouchStart.bind(null, list.id)}
                onTouchEnd={this.handleTouchEnd.bind(null, list.id)}
                style={this.styleA()}
              >
                {list.name}
              </div>
            )
          })}
          <ButtonAddList/>
        </div>


        {/*SINGLE LIST*/}
        {
          this.state.isViewingList
            ? <List handleCloseList={this.handleCloseList} list={this.state.lists.filter((list) => list.id === this.state.currentListIDInView)[0]} items={this.state.items.filter((item) => item._list_ === this.state.currentListIDInView)}/>
            : null
        }


      </div>
    )
  }

  componentDidMount() {

    Firebase.database()
    .ref('/user_lists/' +Firebase.auth().currentUser.uid)
    .on('child_added', (snapshot) => {

      this.setState({lists: this.state.lists.concat(snapshot.val())})
    })

    Firebase.database()
    .ref('/user_lists/' +Firebase.auth().currentUser.uid)
    .on('child_removed', (snapshot) => {

      this.setState({lists: this.state.lists.filter((list) => list.id !== snapshot.val().id)})
    })

    Firebase.database()
    .ref('/user_items/' +Firebase.auth().currentUser.uid)
    .on('child_added', (snapshot) => {

      this.setState({items: this.state.items.concat(snapshot.val())})
    })

    Firebase.database()
    .ref('/user_items/' +Firebase.auth().currentUser.uid)
    .on('child_changed', (snapshot) => {

      this.setState({items: this.state.items.filter((item) => item.id !== snapshot.val().id).concat(snapshot.val())})
    })

    Firebase.database()
    .ref('/user_items/' +Firebase.auth().currentUser.uid)
    .on('child_removed', (snapshot) => {

      this.setState({items: this.state.items.filter((item) => item.id !== snapshot.val().id)})
    })
  }

  handleTouchStart(_list_) {

    this._timerIncrementer = setInterval(() => {
      console.log(1, this.state.touchElapsedTime)
      if (this.state.touchElapsedTime > this._touchElapsedThreshold) {

        this.setState({touchElapsedTime: 0}, () => clearInterval(this._timerIncrementer))
        this.deleteList(_list_)
      }
      else this.setState({touchElapsedTime: this.state.touchElapsedTime + 1})
    }, 1)
  }

  // TODO: side-effects
  handleTouchEnd(_list_) {
    console.log(2, this.state.touchElapsedTime)
    if (this.state.touchElapsedTime < this._touchElapsedThreshold) {

      this.setState({isViewingList: true, currentListIDInView: _list_})
    }

    this.setState({touchElapsedTime: 0}, () => clearInterval(this._timerIncrementer))
  }

  deleteList(_list_) {

    Firebase.database().ref('/user_lists/' +Firebase.auth().currentUser.uid+ '/' +_list_)
    .remove()
    .then((error) => error ? alert(error) : null)
  }

  handleCloseList() {

    this.setState({isViewingList: false})
  }

  styleA() {
    return {
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      // TODO: hmm. can't get some nice equidistant tiles goin'...
      margin: '1vw',
      width: '48vw',
      height: '48vw',
      color: 'white',
      fontFamily: 'helvetica',
      fontWeight: 'bold',
      backgroundColor: '#cccccc',
      borderRadius: 5,
    }
  }
}

export default Home
