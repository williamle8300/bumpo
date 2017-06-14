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

    document.addEventListener('touchmove', (e) => e.preventDefault())
  }
)
