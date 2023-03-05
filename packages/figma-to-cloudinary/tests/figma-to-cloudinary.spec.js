const { figmaToCloudinary } = require('../src/index');

describe('figmaToCloudinary', () => {

  test('generates a Cloudinary URL from a Figma document', async () => {
    const url = await figmaToCloudinary({
      cldCloudId: 'testcloudname',
      figmaFileId: 'EX3SljN6shWaYP8tlGqQ8v',
      figmaNodeId: '0:3',
      textFields: {
        HEADER_TEXT: 'My Cool Social Image That Is a Test for This Thing',
        TAGS: ['Cool', 'Awesome', '1337']
      }
    });
    expect(url).toEqual('https://res.cloudinary.com/testcloudname/image/fetch/w_1012,h_506,b_rgb:0b032a/l_fetch:aHR0cHM6Ly9zMy11cy13ZXN0LTIuYW1hem9uYXdzLmNvbS9maWdtYS1hbHBoYS1hcGkvaW1nLzhmYzYvODY0Ni85YTYzMDE4MWE0NGVmMWI0ZGUyMjE4YmM0MzRjN2VkYg==/w_1432,h_823/fl_layer_apply,fl_no_overflow,x_117,y_-1/c_fit,w_624,co_rgb:b6cfff,l_text:Source%20Sans%20Pro_28_letter_spacing_0_700:Cool%252C%20Awesome%252C%201337/fl_layer_apply,g_west,y_195,x_51/c_fit,w_570,co_rgb:ffffff,l_text:Source%20Sans%20Pro_50_letter_spacing_0_900:My%20Cool%20Social%20Image%20That%20Is%20a%20Test%20for%20This%20Thing/fl_layer_apply,g_west,y_-21,x_51/https%3A%2F%2Fi.imgur.com%2FhcmCzxl.png');
  });

});