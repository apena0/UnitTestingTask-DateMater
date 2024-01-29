describe('Unit Testing Task', () => {
  const unitTestingTask = require('../unitTestingTask');
  const timezoneMock = require('timezone-mock');
  const preloadedDate = '1995-09-05T03:05:03.007';

  it('should return 4-digit year', () => {
    expect(unitTestingTask('YYYY', preloadedDate)).toBe('1995');
  });

  it('should return last 2 digit year', () => {
    expect(unitTestingTask('YY', preloadedDate)).toBe('95');
  });

  it('should return full name of month', () => {
    expect(unitTestingTask('MMMM', preloadedDate)).toBe('September');
  });

  it('should return short name of month', () => {
    expect(unitTestingTask('MMM', preloadedDate)).toBe('Sep');
  });

  it('should return ISO8601 compatible number of month', () => {
    expect(unitTestingTask('MM', preloadedDate)).toBe('09');
  });

  it('should return number of the month in year without zero-padding', () => {
    expect(unitTestingTask('M', preloadedDate)).toBe('9');
  });
  it('should return full name of day', () => {
    expect(unitTestingTask('DDD', preloadedDate)).toBe('Tuesday');
  });

  it('should return shot name of day', () => {
    expect(unitTestingTask('DD', preloadedDate)).toBe('Tue');
  });

  it('should return min name of day', () => {
    expect(unitTestingTask('D', preloadedDate)).toBe('Tu');
  });

  it('should return zero-padded number of day in month', () => {
    expect(unitTestingTask('dd', preloadedDate)).toBe('05');
  });

  it('should return number of day in month', () => {
    expect(unitTestingTask('d', preloadedDate)).toBe('5');
  });

  it('should return zero-padded hour in 24-hr format', () => {
    expect(unitTestingTask('HH', preloadedDate)).toBe('03');
  });

  it('should return hour in 24-hr format', () => {
    expect(unitTestingTask('H', preloadedDate)).toBe('3');
  });

  it('should return zero-padded hour in 12-hour format', () => {
    expect(unitTestingTask('hh', '1995-09-05T13:15:30')).toBe('01');
  });

  it('should return zero-padded hour in 12-hour format in case is 12pm', () => {
    expect(unitTestingTask('hh', '1995-09-05T12:15:30')).toBe('12');
  });

  it('should return hour in 12-hr format in case is 12pm', () => {
    expect(unitTestingTask('h', '1995-09-05T12:15:30')).toBe('12');
  });

  it('should return hour in 12-hr format', () => {
    expect(unitTestingTask('h', '1995-09-05T13:15:30')).toBe('1');
  });

  it('should return zero-padded minutes', () => {
    expect(unitTestingTask('mm', preloadedDate)).toBe('05');
  });

  it('should return minutes', () => {
    expect(unitTestingTask('m', preloadedDate)).toBe('5');
  });

  it('should return zero-padded seconds', () =>
    expect(unitTestingTask('ss', preloadedDate)).toBe('03'));

  it('should return seconds', () => {
    expect(unitTestingTask('s', preloadedDate)).toBe('3');
  });

  it('should return zero-padded milliseconds', () => {
    expect(unitTestingTask('ff', preloadedDate)).toBe('007');
  });

  it('should return miliseconds', () => {
    expect(unitTestingTask('f', preloadedDate)).toBe('7');
  });

  it('should return AM/PM', () => {
    expect(unitTestingTask('A', preloadedDate)).toBe('AM');
  });

  it('should return am/pm', () => {
    expect(unitTestingTask('a', preloadedDate)).toBe('am');
  });

  it('should return AM/PM', () => {
    expect(unitTestingTask('A', '1995-09-05T13:15:30')).toBe('PM');
  });

  it('should return am/pm', () => {
    expect(unitTestingTask('a', '1995-09-05T13:15:30')).toBe('pm');
  });

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

  it('should throw an error if fomat is not a string', () => {
    expect(() => unitTestingTask(5, preloadedDate)).toThrow(TypeError);
  });

  it('should throw an error if fomat is not a string', () => {
    expect(() => unitTestingTask('YYYY', true)).toThrow(TypeError);
  });

  it('Should run noConflict function and return the same unit testing task function', () => {
    expect(unitTestingTask.noConflict()).toBeInstanceOf(Function);
  });

  describe('Languages tests', () => {
    it('If language is not specified, should return the default language', () => {
      expect(unitTestingTask.lang()).toBe('en');
    });

    it('If language is specified, should try tu run module and find it', () => {
      expect(unitTestingTask.lang('uk')).toBe('en');
    });

    it('If language is specified, should try tu run module and find it', () => {
      jest.mock('../lang/uk.js', () => {
        return {};
      });
      expect(unitTestingTask.lang('uk')).toBe('uk');
      jest.clearAllMocks();
    });
  });

  describe('Formatting tests', () => {
    it('Should return list of formatters', () => {
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
  });
});
