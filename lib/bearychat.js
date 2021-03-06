const needle = require('needle');
const robot = require('./robot.js');

class BearyChatRobot extends robot.Robot {
  constructor(opts) {
    super();
    this.team = opts.team;
    this.token = opts.token;
  }

  receivingPath() {
    return '/bearychat';
  }

  // eslint-disable-next-line class-methods-use-this
  stringToMatch(req) {
    return req.text;
  }

  // TODO: check the request token if this.token is set.
  createMessageContext(req, res) {
    const context = super.createMessageContext(req);
    const url = 'https://rtm.bearychat.com/message';
    context.bearychat = {
      team: this.team,
      token: this.token
    };
    res.end();
    context.respond = (resp) => {
      let respObj = { token: req.token, vchannel: req.vchannel };
      if (typeof resp === 'string') {
        respObj.text = resp;
      } else {
        respObj = Object.assign(respObj, resp);
      }
      needle.post(url, respObj, { json: true }, (err) => {
        if (err) {
          console.error('ERROR: %s', err.message);
        }
      });
    };
    return context;
  }
}

module.exports = { BearyChatRobot };
