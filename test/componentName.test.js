import camelCase from 'camelcase';

describe('组件name匹配判断', () => {
    const v = 'fooBar';
    it(`FooBar should equal ${v}`, () => {
        expect(camelCase('FooBar')).toEqual(v);
    });

    it(`foo-Bar should equal ${v}`, () => {
        expect(camelCase('foo-Bar')).toEqual(v);
    });

    it(`foo-bar should equal ${v}`, () => {
        expect(camelCase('foo-bar')).toEqual(v);
    });

    it(`fooBar should equal ${v}`, () => {
        expect(camelCase('fooBar')).toEqual(v);
    });
});