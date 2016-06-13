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

  describe('Keyward handler', function() {
    it('should run if keywords match', function() {
      const bot = new robot.Robot();
      let isRun = false;
      bot.addKeywordHandler(['foo', 'bar'], () => isRun = true);
      bot.handleRequest({text: 'foo is not bar'});
      expect(isRun).to.equal(true);
    });

    it('should not run if any keyword do not match', function() {
      const bot = new robot.Robot();
      let isRun = false;
      bot.addKeywordHandler(['foo', 'bar'], () => isRun = true);
      bot.handleRequest({text: 'foo is not br'});
      expect(isRun).to.equal(false);
    });
  });

  describe('Regex handler', function() {
    it('should run if the regex match', function() {
      const bot = new robot.Robot();
      let isRun = false;
      bot.addRegexHandler(/fo*/, () => isRun = true);
      bot.handleRequest({text: 'foo is not bar'});
      expect(isRun).to.equal(true);
    });

    it('should not run if the regex does not match', function() {
      const bot = new robot.Robot();
      let isRun = false;
      bot.addRegexHandler(/fu+/, () => isRun = true);
      bot.handleRequest({text: 'foo is not bar'});
      expect(isRun).to.equal(false);
    });

    it('should put matches into the context', function() {
      const bot = new robot.Robot();
      let isRun = false;
      bot.addRegexHandler(/fo*/, (ctx) => {
        isRun = true;
        expect(ctx).to.have.property('matches').with.length(1);
        expect(ctx.matches[0]).to.equal('foo');
      });
      bot.handleRequest({text: 'foo is not bar'});
      expect(isRun).to.equal(true);
    });
  });
});
