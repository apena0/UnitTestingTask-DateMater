const unitTestingTask = require('../unitTestingTask');
const timezoneMock = require('timezone-mock');
const preloadedDate = '1995-09-05T03:05:03.007';
const preloadedDatePm = '1995-09-05T12:15:30';
describe('Tests for preloaded tokens ', () => {
  test.each([
    { token: 'YYYY', date: preloadedDate, expec: '1995', desc: '4-digit year' },
    { token: 'YY', date: preloadedDate, expec: '95', desc: 'last 2 digit year'},
    { token: 'MMMM', date: preloadedDate, expec: 'September', desc: 'full name of month'},
    { token: 'MMM', date: preloadedDate, expec: 'Sep', desc: 'short name of month'},
    { token: 'M', date: preloadedDate, expec: '9', desc: ' number of the month in year without zero-padding'},
    { token: 'DDD', date: preloadedDate, expec: 'Tuesday', desc: 'full name of day'},
    { token: 'DD', date: preloadedDate, expec: 'Tue', desc: 'short name of day'},
    { token: 'D', date: preloadedDate, expec: 'Tu', desc: 'min name of day'},
    { token: 'D', date: preloadedDate, expec: 'Tu', desc: 'min name of day'},
    { token: 'dd', date: preloadedDate, expec: '05', desc: 'zero-padded number of day in month'},
    { token: 'd', date: preloadedDate, expec: '5', desc: 'number of day in month'},
    { token: 'HH', date: preloadedDate, expec: '03', desc: 'zero-padded hour in 24-hr format'},
    { token: 'H', date: preloadedDate, expec: '3', desc: 'hour in 24-hr format'},
    { token: 'hh', date: preloadedDate, expec: '03', desc: 'zero-padded hour in 12-hour format'},
    { token: 'hh', date: preloadedDatePm, expec: '12', desc: 'zero-padded hour in 12-hour format in case 12pm'},
    { token: 'h', date: preloadedDate, expec: '3', desc: 'hour in 12-hr format'},
    { token: 'h', date: preloadedDatePm, expec: '12', desc: 'hour in 12-hr format in case 12pm'},
    { token: 'mm', date: preloadedDate, expec: '05', desc: 'zero-padded minutes'},
    { token: 'm', date: preloadedDate, expec: '5', desc: 'return minutes' },
    { token: 'ss', date: preloadedDate, expec: '03', desc: 'zero-padded seconds'},
    { token: 's', date: preloadedDate, expec: '3', desc: 'seconds' },
    { token: 'ff', date: preloadedDate, expec: '007', desc: 'zero-padded milliseconds',},
    { token: 'f', date: preloadedDate, expec: '7', desc: 'milliseconds' },
    { token: 'A', date: preloadedDate, expec: 'AM', desc: 'AM' },
    { token: 'a', date: preloadedDate, expec: 'am', desc: 'am' },
    { token: 'A', date: preloadedDatePm, expec: 'PM', desc: 'PM' },
    { token: 'a', date: preloadedDatePm, expec: 'pm', desc: 'pm' },
  ])('$token should return $desc', ({ token, date, expec, desc }) => {
    expect(unitTestingTask(token, date)).toBe(expec);
  });

  it('Should run noConflict function and return the same unit testing task function', () => {
    expect(unitTestingTask.noConflict()).toBeInstanceOf(Function);
  });

  describe('Time-zone related tests', () => {
    it('should return time-zone in ISO8601-compatible basic format', () => {
      timezoneMock.register('Etc/GMT+5');
      expect(unitTestingTask('ZZ', preloadedDate)).toBe('-0500');
      timezoneMock.unregister();
    });

    it('should return time-zone in ISO8601-compatible basic format plus hours', () => {
      timezoneMock.register('Europe/London');
      expect(unitTestingTask('ZZ', preloadedDate)).toBe('+0100');
      timezoneMock.unregister();
    });

    it('should return time-zone in ISO8601-compatible extended format', () => {
      timezoneMock.register('UTC');
      expect(unitTestingTask('Z', preloadedDate)).toBe('+00:00');
      timezoneMock.unregister();
    });
  });

  describe('Errors tests', () => {

    it('should throw an error if fomat is not a string', () => {
      expect(() => unitTestingTask(5, preloadedDate)).toThrow(TypeError);
    });

    it('should throw an error if argument date is not a valid type of Date', () => {
      expect(() => unitTestingTask('YYYY', true)).toThrow(TypeError);
    });
  });

  

  describe('Languages tests', () => {

    it('If language is not specified, should return the default language', () => {
      expect(unitTestingTask.lang()).toBe('en');
    });

    it('If language is specified and module is not found, should return default language ', () => {
      expect(unitTestingTask.lang('uk')).toBe('en');
    });
    
    it('If language is specified, should try to run module and find it', () => {
      jest.mock('../lang/uk.js', () => {
        return {};
      });
      expect(unitTestingTask.lang('uk')).toBe('uk');
      jest.clearAllMocks();
    });

    it('If language is specified and is not equal to default language, should change to current language', () => {
      unitTestingTask.lang("en");
      unitTestingTask.lang('uk');
      expect(unitTestingTask.lang()).toBe('uk');
    });
  });

  describe('Formatting tests', () => {
    it('Should return list of preloaded formatters', () => {
      const objectKeysArray = [
        'ISODate',
        'ISOTime',
        'ISODateTime',
        'ISODateTimeTZ',
      ];
      expect(unitTestingTask.formatters()).toStrictEqual(objectKeysArray);
    });

    it('Should format date with selected formatter ', () => {
      expect(unitTestingTask('ISODate', preloadedDate)).toBe('1995-09-05');
    });

    it('Should return a new date in ISOformat if are more than 2 arguments in the function', () => {
      const newDate = unitTestingTask('ISODate', new Date())
      expect(unitTestingTask('ISODate', "YYYY",preloadedDate)).toBe(newDate);
    });

  });
});
