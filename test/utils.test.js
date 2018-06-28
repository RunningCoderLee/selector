import { TypeOf } from '../src/utils';
import assert from 'assert';

describe('test the TypeOf function', () => {
  describe('test array', () => {
    it('should return array when the value is a list', () => {
      assert.equal(TypeOf([1,2]), 'array');
      assert.equal(TypeOf(new Array()), 'array');
    });
  });

  describe('test object', () => {
    it('should return object when the value is a object', () => {
      assert.equal(TypeOf({}), 'object');
      assert.equal(TypeOf(new Object()), 'object');
    });
  });

  describe('test number', () => {
    it('should return number when the value is a number', () => {
      assert.equal(TypeOf(1), 'number');
    });

    it('should return number when the value is wrapped by Number object', () => {
      assert.equal(TypeOf(Number(1)), 'number');
    });
  });

  describe('test string', () => {
    it('should return string when the value is a string', () => {
      assert.equal(TypeOf('1'), 'string');
    });

    it('should return string when the value is a empty string', () => {
      assert.equal(TypeOf(''), 'string');
    });

    it('should return string when the value is wrapped by String object', () => {
      assert.equal(TypeOf(String(1)), 'string');
    });
  });

  describe('test undefined', () => {
    it('should return undefined when the value is undefined', () => {
      assert.equal(TypeOf(undefined), 'undefined');
    });
  });

  describe('test null', () => {
    it('should return null when the value is null', () => {
      assert.equal(TypeOf(null), 'null');
    });
  });

  describe('test function', () => {
    it('should return function when the value is function', () => {
      assert.equal(TypeOf(function() {}), 'function');
    });
  });

  describe('test regex', () => {
    it('should return regexp when the value is regexp', () => {
      assert.equal(TypeOf(/\./), 'regexp');
      assert.equal(TypeOf(new RegExp()), 'regexp');
    });
  });
})