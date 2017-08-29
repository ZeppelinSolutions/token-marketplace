import React from 'react'
import App from './App.react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import createBrowserHistory from 'history/createBrowserHistory'
const browserHistory = createBrowserHistory()

const Root = ({ store }) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <App/>
    </Router>
  </Provider>
)

export default Root
