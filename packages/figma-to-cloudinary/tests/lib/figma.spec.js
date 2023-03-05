const { colorsToRGB } = require('../../src/lib/figma');

describe('colorsToRGB', () => {

  test('converts a an array of colors to a RGB strings', () => {
    const colors = [
      {
        blendMode: 'NORMAL',
        type: 'SOLID',
        color: {
          r: 1,
          g: 1,
          b: 1,
          a: 1
        }
      },
      {
        blendMode: 'NORMAL',
        type: 'SOLID',
        color: {
          r: .4,
          g: .2,
          b: .7,
          a: .5
        }
      },
    ];
    expect(colorsToRGB(colors)[0]).toEqual('ffffff');
    expect(colorsToRGB(colors)[1]).toEqual('6633b3');
  });

});