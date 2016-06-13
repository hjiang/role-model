const expect = require('chai').expect;
const robot = require('../lib/robot');

/** 
 * Do not change the callbacks to arrow functions yet! The Mocha site
 * says: Passing arrow functions to Mocha is discouraged. Their
 * lexical binding of the this value makes them unable to access the
 * Mocha context, and statements like this.timeout(1000); will not
 * work inside an arrow function.
 */

describe('Robot', function() {
  describe('handleRequest', function() {
    it('should call handler if predicate is true', function() {
      let isRun = false;
      const bot = new robot.Robot();
      bot.addPredHandler(() => true, () => isRun = true);
      bot.handleRequest({});
      expect(isRun).to.equal(true);
    });

    it('should not call handler if predicate is true', function() {
      let isRun = false;
      const bot = new robot.Robot();
      bot.addPredHandler(() => false, () => isRun = true);
      bot.handleRequest({});
      expect(isRun).to.equal(false);
    });

    it('should only run the first matching handler', function() {
      let isFirstRun = false;
      let isSecondRun = false;
      const bot = new robot.Robot();
      bot.addPredHandler(() => true, () => isFirstRun = true);
      bot.addPredHandler(() => true, () => isSecondRun = true);
      bot.handleRequest({});
      expect(isFirstRun).to.equal(true);
      expect(isSecondRun).to.equal(false);
    });
  });

  describe('addKeywordHandler', function() {
    it('should run the handler if keywords match', function() {
      const bot = new robot.Robot();
      let isRun = false;
      bot.addKeywordHandler(['foo', 'bar'], () => isRun = true);
      bot.handleRequest({text: 'foo is not bar'});
      expect(isRun).to.equal(true);
    });

    it('should not run the handler if any keyword do not match', function() {
      const bot = new robot.Robot();
      let isRun = false;
      bot.addKeywordHandler(['foo', 'bar'], () => isRun = true);
      bot.handleRequest({text: 'foo is not br'});
      expect(isRun).to.equal(false);
    });
  });
});
