import React from 'react';
import ReactDOM from 'react-dom';
import Panel from '../panel';
import './index.scss'

ReactDOM.render(
  <div className="page">
    <div className="title">This is home page</div>
    <article>
      <Panel>This is my homepage</Panel>
    </article>
  </div>, document.querySelector("#container"));
