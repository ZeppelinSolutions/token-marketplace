import React from 'react'

class Modal extends React.Component {
  constructor(props){
    super(props)
    this.state = { open: this.props.open, message: this.props.message }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ open: nextProps.open, message: nextProps.message })
  }

  render() {
    return (
      <div id="overlay" className={this.state.open ? '' : 'hidden'}>
        <div className="content">
          <h4>{this.state.message}</h4>
          <div className="progress">
            <div className="indeterminate"/>
          </div>
        </div>
      </div>
    )
  }
}

export default Modal;
