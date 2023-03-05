require('dotenv').config();

const { getDocumentByFileNode, getImagesByFileNodes, colorsToRGB } = require('./lib/figma');

async function figmaToCloudinary(settings = {}) {
  const {
    cldCloudId,
    figmaFileId,
    figmaNodeId,
    textFields = {},
    options = {}
  } = settings;

  const {
    baseImageId = 'https://i.imgur.com/hcmCzxl.png',
    baseImageMethod = 'fetch'
  } = options;

  const document = await getDocumentByFileNode({
    fileId: figmaFileId,
    nodeId: figmaNodeId
  });
  
  const frame = document.children[0].children[0];

  const imageNodes = frame.children.filter(({ type }) => type !== 'TEXT');
  const imageNodeIds = imageNodes.map(({ id }) => id);

  const textNodes = frame.children.filter(({ type }) => type === 'TEXT');

  const imageData = await getImagesByFileNodes({
    fileId: figmaFileId,
    nodeIds: imageNodeIds,
    options: {
      format: 'png',
      useAbsoluteBounds: true
    }
  });

  const imageLayers = imageNodes
    .map(node => {
      const { x, y, width, height } = node.absoluteBoundingBox;
      return {
        x: Math.round(width / 2) + x,
        y: Math.round(height / 2) + y,
        width: Math.round(width),
        height: Math.round(height),
        imageUrl: imageData.images[node.id]
      }
    })
    .filter(({ imageUrl }) => !!imageUrl)
    .map(layer => {
      const { imageUrl, width, height, x, y } = layer;
      return `l_fetch:${Buffer.from(imageUrl).toString('base64')}/w_${width},h_${height}/fl_layer_apply,fl_no_overflow,x_${x},y_${y}`;
    });

  const backgroundColor = colorsToRGB(frame.background)?.[0];
  const backgroundLayer = `w_${frame.absoluteBoundingBox.width},h_${frame.absoluteBoundingBox.height},b_rgb:${backgroundColor}`;

  const textLayers = textNodes
    .filter(({ name }) => !!textFields[name])
    .map(node => {
      const { name, style, fills, absoluteBoundingBox } = node;
      const { fontFamily, fontWeight, fontSize, letterSpacing } = style;
      const { x, y, width, height } = absoluteBoundingBox;

      let value = textFields[name]

      if ( Array.isArray(value) ) {
        value = value.join(', ');
      }
      
      value = value.replace(/,/g, escape(','));

      const color = colorsToRGB(fills)?.[0];
      
      const config = {
        c: 'fit',
        w: width,
        co: `rgb:${color}`,
        l: `text:${encodeURIComponent(fontFamily)}_${fontSize}_letter_spacing_${letterSpacing}_${fontWeight}:${encodeURIComponent(value)}`
      }

      const transform = Object.keys(config).map(key => `${key}_${config[key]}`).join(',');

      const layerConfig = {
        g: [],
        
        y: Math.round(height / 2) + y
      }

      if ( style.textAlignVertical === 'TOP' ) {
        layerConfig.g.push('north')
      }

      if ( style.textAlignHorizontal === 'LEFT' ) {
        layerConfig.g.push('west')
        layerConfig.x = ( ( frame.absoluteBoundingBox.x * -1 ) - ( x * -1) );
      }

      layerConfig.g = layerConfig.g.join('_');

      const layer = `fl_layer_apply,${Object.keys(layerConfig).map(key => `${key}_${layerConfig[key]}`).join(',')}`;

      return `${transform}/${layer}`;
    });
  
  const layerFragments = [].concat([backgroundLayer], imageLayers, textLayers);

  const url = `https://res.cloudinary.com/${cldCloudId}/image/${baseImageMethod}/${layerFragments.join('/')}/${encodeURIComponent(baseImageId)}`;

  return url;
}

module.exports.figmaToCloudinary = figmaToCloudinary;