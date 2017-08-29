'use strict'
require('babel-register')
require('babel-polyfill')

import React from 'react'
import ReactDOM from 'react-dom'
import Root from './app/components/Root.react'
import Store from './app/store'

ReactDOM.render(<Root store={Store} />, document.getElementById('app'))
