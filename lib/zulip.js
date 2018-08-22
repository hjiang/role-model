const needle = require('needle');
const robot = require('./robot.js');

class ZulipRobot extends robot.Robot {
  constructor(opts) {
    super();
    this.team = opts.team;
    this.token = opts.token;
    this.serverUrl = opts.serverUrl;
  }

  receivingPath() {
    return '/zulip';
  }

  // TODO: check the request token if this.token is set.
  createMessageContext(req) {
    const context = super.createMessageContext(req);
    context.zulip = {
      team: this.team,
      token: this.token
    };
    context.respond = (resp) => {
      let respObj = { token: req.token };
      if (typeof resp === 'string') {
        respObj.response_string = resp;
      } else {
        respObj = Object.assign(respObj, resp);
      }
      needle.post(this.serverUrl, respObj, { json: true }, (err) => {
        if (err) {
          console.error('ERROR: %s', err.message);
        }
      });
    };
    return context;
  }
}

module.exports = { ZulipRobot };
