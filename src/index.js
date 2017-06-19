export default class Library {
  constructor() {
    this._name = 'Library';
  }
  get name() {
    return this._name;
  }
}

export function showMsg(msg) {
  alert(msg);
}
