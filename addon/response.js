import { warn } from '@ember/debug';
export default class Response {

  constructor(code, headers = {}, data) {
    this.code = code;
    this.headers = headers;

    // Default data for "undefined 204" responses to empty string (no content)
    if (code === 204) {
      if (data !== undefined && data !== '') {
        warn(
          `Mirage: One of your route handlers is returning a custom
          204 Response that has data, but this is a violation of the HTTP spec
          and could lead to unexpected behavior. 204 responses should have no
          content (an empty string) as their body. [warning id:
          ember-cli-mirage.warn-response-204-non-empty-payload]`,
          false,
          { id: 'ember-cli-mirage.warn-response-204-non-empty-payload' }
        );
      } else {
        this.data = '';
      }

    // Default data for "empty untyped" responses to empty JSON object
    } else if ((data === undefined || data === '') && !this.headers.hasOwnProperty('Content-Type')) {
      this.data = {};

    } else {
      this.data = data;
    }

    // Default "untyped" responses to application/json
    if (!this.headers.hasOwnProperty('Content-Type')) {
      this.headers['Content-Type'] = 'application/json';
    }
  }

  toRackResponse() {
    return [ this.code, this.headers, this.data ];
  }

}
