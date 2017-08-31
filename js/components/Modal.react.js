import React from 'react'

class Modal extends React.Component {
  constructor(props){
    super(props)
    this.state = { open: this.props.open, message: this.props.message, progressBar: this.props.progressBar }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ open: nextProps.open, message: nextProps.message })
  }

  render() {
    return (
      <div id="overlay" className={this.state.open ? '' : 'hidden'}>
        <div className="content">
          <h4>{this.state.message}</h4>
          {this._renderProgressBar()}
        </div>
      </div>
    )
  }

  _renderProgressBar() {
    if(this.state.progressBar) return (
      <div className="progress">
        <div className="indeterminate"/>
      </div>
    )
  }
}

export default Modal;
