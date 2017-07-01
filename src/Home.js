import List from './List'
import ButtonAddList from './ButtonAddList'


import React, {Component} from 'react'
import Firebase from './Firebase'


class Home extends Component {

  constructor(props) {

    super(props)
    this.state = {
      // scrollElapsed: 0,
      blockListInteraction: false,
      isViewingList: false,
      isEditingList: false,
      currentListIDInView: null,
      currentListIDInEdit: null,
      touchElapsedTime: 0,
      lists: [],
      items: [],
    }
    this._touchElapsedThreshold = 100
    this.handleScroll = this.handleScroll.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
    this.handleCloseList = this.handleCloseList.bind(this)
  }


  render () {
    return (
      <div style={{height: '100%'}}>

        {/*BOX*/}
        <div style={{height: '100%'}}>

          {/*LISTS*/}
          <div onScroll={this.handleScroll} style={{display: 'flex', flexWrap: 'wrap', height: '90%', overflow: 'scroll', overflowScrolling: 'touch', WebkitOverflowScrolling: 'touch'}}>
            {this.state.lists.map((list) => {
              return (
                <div
                  key={list.id}
                  style={this.styleA(this.props, this.state, list.id)}
                >
                  {/*modal background*/}
                  <div
                    onTouchStart={() => this.setState({isEditingList: false, currentListIDInEdit: null})}
                    style={this.styleB(this.props, this.state, list.id)}
                  />
                  {/*modal*/}
                  <div
                    style={this.styleC(this.props, this.state, list.id)}
                  >
                    {/* details */}
                    <div
                      onTouchStart={this.handleTouchStart.bind(null, list.id)}
                      onTouchEnd={this.handleTouchEnd.bind(null, list.id)}
                      style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}
                    >
                      <div>{list.name}</div>
                    </div>
                    {/* "delete" button */}
                    <div onTouchTap={this.deleteList.bind(null, list.id)} style={this.styleD(this.props, this.state, list.id)}>
                      delete
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
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

  handleScroll(event) {

    // TODO: throttle
    this.setState({blockListInteraction: true})
  }

  handleTouchStart(_list_) {

    this._timerIncrementer = setInterval(() => {

      if (!this.state.blockListInteraction && this.state.touchElapsedTime > this._touchElapsedThreshold) {

        clearInterval(this._timerIncrementer)
        this.setState({isEditingList: !this.state.isEditingList, currentListIDInEdit: _list_})
      }
      else this.setState({touchElapsedTime: this.state.touchElapsedTime + 1})
    }, 1)
  }

  // FIXME: impure function: side-effects
  handleTouchEnd(_list_) {

    if (!this.state.blockListInteraction && this.state.touchElapsedTime < this._touchElapsedThreshold) {

      this.setState({
        isViewingList: true,
        currentListIDInView: _list_,
        isEditingList: false,
        currentListIDInEdit: null,
      })
    }

    this.setState({touchElapsedTime: 0, blockListInteraction: false}, () => clearInterval(this._timerIncrementer))
  }

  deleteList(_list_) {

    Firebase.database().ref('/user_lists/' +Firebase.auth().currentUser.uid+ '/' +_list_)
    .remove()
    .then((error) => error ? alert(error) : null)
  }

  handleCloseList() {

    this.setState({isViewingList: false, currentListIDInView: null})
  }

  styleA(props, state, _list_) {
    return {
      // position: state.currentListIDInEdit === _list_ ? 'fixed' : 'static',
      // top: state.currentListIDInEdit === _list_ ? '50%' : 'inherit',
      // left: state.currentListIDInEdit === _list_ ? '50%' : 'inherit',
      // display: 'flex',
      // FIXME: hmm. can't get some nice equidistant tiles goin'...
      margin: '1vw',
      width: '48vw',
      height: '48vw',
      color: 'white',
      fontFamily: 'helvetica',
      fontWeight: 'bold',
      backgroundColor: '#555555',
      borderRadius: 5,
    }
  }

  styleB(props, state, _list_) {
    return {
      position: state.currentListIDInEdit === _list_ ? 'fixed' : 'static',
      top: state.currentListIDInEdit === _list_ ? 0 : 'inherit',
      left: state.currentListIDInEdit === _list_ ? 0 : 'inherit',
      width: state.currentListIDInEdit === _list_ ? '100%' : 0,
      height: state.currentListIDInEdit === _list_ ? '100%' : 0,
      backgroundColor: state.currentListIDInEdit === _list_ ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
    }
  }

  styleC(props, state, _list_) {
    return {
      position: state.currentListIDInEdit === _list_ ? 'fixed' : 'static',
      top: state.currentListIDInEdit === _list_ ? '50%' : 'inherit',
      left: state.currentListIDInEdit === _list_ ? '50%' : 'inherit',
      width: state.currentListIDInEdit === _list_ ? '50vw' : '100%',
      height: state.currentListIDInEdit === _list_ ? '50vw' : '100%',
      backgroundColor: '#bbbbbb',
      transform: state.currentListIDInEdit === _list_ ? 'translate(-50%, -50%)' : 'none',
      borderRadius: 5,
    }
  }

  styleD(props, state, _list_) {
    return {
      position: 'absolute',
      bottom: '0',
      display: state.currentListIDInEdit === _list_ ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem 0',
      width: '100%',
      backgroundColor: 'red',
    }
  }
}

export default Home
