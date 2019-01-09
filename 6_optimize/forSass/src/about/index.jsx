import React from 'react';
import ReactDOM from 'react-dom';
import Panel from '../panel';
import './index.scss'

ReactDOM.render(
  <div className="page">
    <div className="title">This is my about page</div>
    <article>
      <Panel>This is my about page</Panel>
    </article>
  </div>, document.querySelector("#container"));
