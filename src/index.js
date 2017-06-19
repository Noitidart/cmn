export { default as all } from './all'
export { default as dom } from './dom'
export { default as background } from './background'
export { default as qs } from './qs'

export default class Library {
  constructor() {
    this._name = 'Library';
  }
  get name() {
    return this._name;
  }
}