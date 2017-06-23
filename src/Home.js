import List from './List'
import Item from './Item'
import ButtonAddList from './ButtonAddList'


import React, {Component} from 'react'
import Firebase from './Firebase'


class Home extends Component {

  constructor(props) {

    super(props)
    this.state = {
      isViewingList: false,
      lists: [{name: 'errands'}],
      items: [],
    }
  }


  render () {
    return (
      <div style={{height: '100%'}}>
        <div style={{height: '100%'}}>
          {this.state.lists.map((list) => <h1 onTouchTap={() => this.setState({isViewingList: true})}>{list.name}</h1>)}
          <ButtonAddList/>
        </div>
        {this.state.isViewingList ? <List items={this.state.items}/> : null}
      </div>
    )
  }

  componentDidMount() {

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
