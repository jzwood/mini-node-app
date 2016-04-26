export class Hello {
  constructor() {
    this.__msg = 'Hello World!'
  }

  set message(msg) { this.__msg = msg }
  get message() { return this.__msg }
}
