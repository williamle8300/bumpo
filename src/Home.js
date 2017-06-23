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
      lists: [],
      items: [],
    }
  }


  render () {
    return (
      <div style={{height: '100%'}}>
        <div style={{display: 'flex', height: '100%'}}>
          {this.state.lists.map((list) => <button key={list.id} onTouchTap={() => this.setState({isViewingList: true, currentListIDInView: list.id})}>{list.name}</button>)}
          <ButtonAddList/>
        </div>
        {this.state.isViewingList ? <List _list_={this.state.currentListIDInView} items={this.state.items.filter((item) => item._list_ === this.state.currentListIDInView)}/> : null}
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
}

export default Home
