import combineSchemas from '.';

test('combineSchemas concatenates string with two new lines', () => {
    expect(combineSchemas('testOldSchema', 'testNewSchema')).toEqual('testNewSchema\n\ntestOldSchema');
    expect(combineSchemas('this is a \ntest with\nnewlines', 'test')).toEqual('test\n\nthis is a \ntest with\nnewlines');
});