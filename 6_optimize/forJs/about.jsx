import React from 'react';
import ReactDOM from 'react-dom';
import Panel from './panel'
import {hello} from './util';
hello();
ReactDOM.render(<Panel>This is a Panel in About</Panel>, document.querySelector('#container'));
