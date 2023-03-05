const fetch = require('node-fetch');
const rgbHex = require('rgb-hex');

/**
 * getDocumentByFileNode
 */

async function getDocumentByFileNode({ fileId, nodeId }) {
  const fileResponse = await fetch(`https://api.figma.com/v1/files/${fileId}/?node-id=${nodeId}`, {
    headers: {
      'X-Figma-Token': process.env.FIGMA_ACCESS_TOKEN
    }
  });
  const fileData = await fileResponse.json();
  const { document } = fileData;

  return document;
}

module.exports.getDocumentByFileNode = getDocumentByFileNode;

/**
 * getImagesByFileNodes
 */

async function getImagesByFileNodes({ fileId, nodeIds, options = {} }) {
  const { format, useAbsoluteBounds } = options;
  
  const imageResponse = await fetch(`https://api.figma.com/v1/images/${fileId}?ids=${nodeIds.join(',')}&format=${format}&use_absolute_bounds=${useAbsoluteBounds}`, {
    headers: {
      'X-Figma-Token': process.env.FIGMA_ACCESS_TOKEN
    }
  });
  const imageData = await imageResponse.json();

  return imageData;
}

module.exports.getImagesByFileNodes = getImagesByFileNodes;

/**
 * colorsToRGB
 */

function colorsToRGB(sets) {
  return sets
    .map(({ color }) => [color.r, color.g, color.b])
    .map(set => {
      const rgb = set.map(color => Math.round(color * 255))
      return rgbHex(...rgb);
    });
}

module.exports.colorsToRGB = colorsToRGB;