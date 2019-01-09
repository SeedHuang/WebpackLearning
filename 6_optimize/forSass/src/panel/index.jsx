import React, { PureComponent } from 'react';
import './index.scss';

class Panel extends PureComponent {
  render() {
    return <div className="panel" {...this.props}/>
  }
}

export default Panel;
