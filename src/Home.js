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
    this.handleCloseList = this.handleCloseList.bind(this)
  }


  render () {
    return (
      <div style={{height: '100%'}}>


        {/*ALL LISTS*/}
        <div style={{display: 'flex', flexWrap: 'wrap', padding: '1rem', height: '100%'}}>
          {this.state.lists.map((list) => {
            return (
              <div
                key={list.id}
                onTouchTap={() => this.setState({isViewingList: true, currentListIDInView: list.id})}
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

  handleCloseList() {

    this.setState({isViewingList: false})
  }

  styleA() {
    return {
      'justify-content': 'center',
      'align-items': 'center',
      display: 'flex',
      margin: '1%',
      width: '48%',
      height: '33vh',
      color: 'white',
      fontFamily: 'helvetica',
      fontWeight: 'bold',
      'background-color': '#cccccc',
      'border-radius': 5,
    }
  }
}

export default Home
