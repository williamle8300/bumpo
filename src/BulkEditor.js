import Firebase from './Firebase'
import React, {Component} from 'react'


class BulkEditor extends Component {

  constructor(props) {

    super(props)
    this.state = {
      text: ''
    }
    this.handleInput = this.handleInput.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  render () {
    return (
      <div style={this.styleD(this.props, this.state)} ref={(element) => this._formRef = element}>
        <form action>
          <textarea
            ref={(element) => {this._textareaRef = element}}
            value={this.state.text}
            onChange={this.handleInput}
          />
        </form>
        <button onTouchTap={this.handleSubmit}>UPDATE</button>
        <button onTouchTap={this.props.toggleBulkEditor}>CLOSE</button>
      </div>
    )
  }

  componentDidMount() {

    this.setState({text: this.textifyItemText(this.props.items)})
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.props.isVisible) this._textareaRef.focus()

    // Hack for Mobile Safari to manually hide keyboard
    if (!this.props.isVisible) document.activeElement.blur()

    if (!this.haveItemsUpdated(prevProps.items, this.props.items)) this.setState({text: this.textifyItemText(this.props.items)})
  }

  haveItemsUpdated(prevItems, currentItems) {

    const prevItemsText = prevItems.map((item) => item.text)
    const currentItemsText = currentItems.map((item) => item.text)


    //Reference: https://stackoverflow.com/a/38693865/1775026
    return prevItemsText.length === currentItemsText.length && prevItemsText.every((element, index) => {

      if(currentItemsText.indexOf(element) > -1){
        return element = currentItemsText[currentItemsText.indexOf(element)]
      }
    })
  }

  handleInput (e) {

    this.setState({text: e.target.value})
  }

  handleSubmit() {

    const oldItemsText = this.props.items.map((item) => item.text)
    const newItemsText = this.splitTextIntoArray(this.state.text)
    const removedItemsText = this.calcArrayDifference(oldItemsText, newItemsText)
    const addedItemsText = this.calcArrayDifference(newItemsText, oldItemsText)

    // FIXME: impure function: side-effects!
    this.removeItems(removedItemsText)
    this.addItems(addedItemsText)
    this.props.toggleBulkEditor()
    console.log(removedItemsText, addedItemsText)
  }

  textifyItemText(items) {
    return items.map((item) => item.text).join('\r\n')
  }

  splitTextIntoArray(rawString) {
    return rawString.replace(/\n*$/, '').split('\n').filter((text) => text.length)
  }

  calcArrayDifference(a, b) {

    // Reference: https://stackoverflow.com/questions/1187518/javascript-array-difference/27997169#27997169
    // const a = [1, 2, 3, 4]
    // const b = [1, 2]
    // => [3, 4]

    const b1 = new Set(b)


    return [...new Set([...a].filter(x => !b1.has(x)))]
  }

  removeItems(removedItemsText) {

    const removedItemsIds = this.props.items.filter((item) => removedItemsText.indexOf(item.text) > -1 ? true : false).map((item) => item.id)

    removedItemsIds.map((removedItemsId) => {

      Firebase.database().ref('/user_items/' +Firebase.auth().currentUser.uid+ '/' +removedItemsId)
      .remove()
      .then((error) => error ? alert(error) : null)
    })
  }

  addItems(addedItemsText) {

    addedItemsText.map((text) => {

      const id = Firebase.database().ref('user_items/' +Firebase.auth().currentUser.uid).push().key


      Firebase.database()
      .ref('user_items/' +Firebase.auth().currentUser.uid+ '/' +id)
      .set({
        id: id,
        timestamp: Firebase.database.ServerValue.TIMESTAMP,
        lastUpdated: Firebase.database.ServerValue.TIMESTAMP,
        text: text,
        _list_: this.props._list_,
        isCompleted: false,
        score: 1,
      }, (error) => error ? alert(error) : null)
    })
  }

  styleD(props, state) {
    return {
      zIndex: 1,
      position: 'fixed',
      top: '-100%',
      left: 0,
      display: 'flex',
      width: '100%',
      height: '100%',
      background: 'green',
      transform: props.isVisible ? 'translate(0, 100%)' : 'none',
      transition: 'all 300ms ease-out',
    }
  }
}

export default BulkEditor
