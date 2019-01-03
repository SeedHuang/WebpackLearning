import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

class Panel extends PureComponent {
  render() {
    return <div id="hello">{this.props.children}</div>
  }
}

export default Panel;
