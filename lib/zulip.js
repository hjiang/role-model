const robot = require('./robot.js');

class ZulipRobot extends robot.Robot {
  constructor(opts) {
    super();
    this.team = opts.team;
    this.token = opts.token;
  }

  receivingPath() {
    return '/zulip';
  }

  stringToMatch(req) {
    return req.data;
  }

  // TODO: check the request token if this.token is set.
  createMessageContext(req, res) {
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
      res.send(respObj);
    };
    return context;
  }
}

module.exports = { ZulipRobot };
