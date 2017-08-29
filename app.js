'use strict'
require('babel-register')
require('babel-polyfill')

import React from 'react'
import ReactDOM from 'react-dom'
import App from './app/components/App.react'

ReactDOM.render(<App/>, document.getElementById('app'))
