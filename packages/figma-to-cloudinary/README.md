# Figma to Cloudinary

Transform a Figma artboard into a Cloudinary URL!

**This is super experimental and is not officially supported by Cloudinary**

## Getting Started

1. Install dependencies

```shell
yarn add @spacejelly/figma-to-cloudinary
# or
npm install @spacejelly/figma-to-cloudinary
```

2. Import dependencies

```js
const { figmaToCloudinary } = require('@spacejelly/figma-to-cloudinary');
```

3. Add environment variables

Create a `.env` file with the following fields configured:

```shell
FIGMA_ACCESS_TOKEN="[Your Figma Access Token]"
```

3. Configure and run script!

```js
await figmaToCloudinary({
  cldCloudId: 'your-cloudinary-cloud-name',
  figmaFileId: 'figma-file-id',
  figmaNodeId: 'figma-node-id',
  textFields: {
    FIGMA_TEXT_FIELD_NAME: 'Text'
  }
});
```

## Configuration

### Settings

| Name            | Type   | Description                      |
| ----------------|--------|----------------------------------|
| cldCloudId      | string | Cloudinary Cloud ID              |
| figmaFileId     | string | Figma File ID                    |
| figmaNodeId     | string | Figma File Node ID               |
| textFields      | object | Dynamic text layers              |
| options         | object | Additional configuration options |

#### Options

The following can be passed along as properties to the `options` object:

| Name            | Type   | Default                         | Description |
| ----------------|--------| --------------------------------| ------------|
| baseImageId     | string | https://i.imgur.com/hcmCzxl.png | External image or Cloudinary Public Image ID used for the Cloudinary base layer |
| baseImageMethod | string | fetch                           | Method used for the Cloudinary Image API (Ex: upload, fetch) |

### Dynamic Text Layers

To set up the ability to dynamically create text fields, you'll want to correctly indicate which fields in your Figma document are being used to do so by creating recognizable names of those text layers.

Inside Figma, when creating a Text layer, rename the layer itself to your Text Field Name, such as `HEADER_TEXT`. When configuring this tool, you can use that `HEADER_TEXT` as a property inside of `textFields` to dynamically set that value when rendering the artboard.

### Organizing Your Figma Document

For best results with the current state of this tool, when rendering images it's recommended that each of the top level groups inside of your Figma artboard are considered to be in a rendered state.

When rendering the groups, this tool will use the Figma API to render that top level group "as is" without any layer effects.

Consider organizing your Figma artboard along the lines of:
```
My Artboard
- TEXT_LAYER_1 (Text layer)
- TEXT_LAYER_2 (Text layer)
- My Background Group (Group including all to-be-rendered imagery)
```

## FAQ

### How do I find my Figma File ID and File Node ID?

The easiest way to find your Figma File & Node ID is to use the Share feature.

Select your artboard in your Figma document and click Share. With the Share dialogue open, click Copy Link where you'll receive a URL in the following format:

```
https://www.figma.com/file/ABCD1234/Untitled?node-id=0%3A1
```

In the above, we can see our two values:
- File ID: `ABCD1234`
- Node ID: `0%3A1` or when decoded `0:1`

### What is the base image used for?

The base image defined as an external URL or Cloudinary Image ID (Public ID) is used to provide the base layer under all of the layers rendered from Figma. If you're using a real image, you would want to take this into consideration when building your image in Figma, otherwise like the default image used, you can use a transparent image as your base layer, using Figma for all layering needs.