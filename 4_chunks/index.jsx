import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

const a = _.chunk([1,2,3,4], 2);

RenderDOM.render(<div>This is INDEX page {a.toString()}</div>, document.querySelector('#container'));
