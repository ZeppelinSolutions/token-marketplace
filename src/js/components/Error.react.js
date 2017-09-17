import React from 'react'
import Store from '../store'
import ErrorActions from "../actions/errors";

export default class Error extends React.Component {
  constructor(props){
    super(props)
    this.state = { error: null }
    this._cleanError = this._cleanError.bind(this)
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
  }

  render() {
    const error = this.state.error;
    return !error ? <div ref="error"/> :
      <div ref="error">
        <div className="row">
          <div className="col s12">
            <div className="card red lighten-1">
              <div className="card-content white-text">
                <p className="center">{error} <span className="close-error" onClick={this._cleanError}>x</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
  }

  _cleanError(e) {
    e.preventDefault();
    this.setState({ error: null })
    Store.dispatch(ErrorActions.reset())
  }

  _onChange() {
    if(this.refs.error) {
      const state = Store.getState()
      this.setState({ error: state.error })
    }
  }
}
