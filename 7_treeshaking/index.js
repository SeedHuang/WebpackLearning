/*

// utils_seedhuang index content
const myName = "My Name Seed Huang"

export function cloneDeep (obj) {
  return JSON.parse(JSON.stringify(obj));
};

export function isNotNull (obj) {
  console.log("this is not null");
  return obj !== null && obj !== undefined;
}

export function isNotEmpty (str) {
  console.log("is not empty");
  return isNotNull(str) && str !== '';
}

export function createAPerson (str) {
  console.log("this is create A Person");
  return new Person();
}

function ThisA () {
  alert(myName);
}

ThisA();

*/

import { isNotNull } from './node_modules/utils_seedhuang/src/index';
