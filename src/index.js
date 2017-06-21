import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import injectTapEventPlugin from 'react-tap-event-plugin'


injectTapEventPlugin()
registerServiceWorker()

ReactDOM.render(
  <App />,
  document.getElementById('root'),
  () => {

    // Lock screen. All touch events & scrolling is re-created
    // document.ontouchstart = (e) => e.preventDefault()
    // document.getElementsByTagName('ul')[0].ontouchstart = (e) => e.stopPropagation()
    document.documentElement.setAttribute('style', 'position: fixed; width: 100%; height: 100%;')
    document.body.setAttribute('style', 'position: fixed; width: 100%; height: 100%;')
    document.getElementById('root').setAttribute('style', 'position: fixed; width: 100%; height: 100%;')
  }
)
