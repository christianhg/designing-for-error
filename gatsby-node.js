const path = require('path');
const crypto = require('crypto');

// Remove trailing slash
exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  return new Promise(resolve => {
    // Remove trailing slash
    const newPage = Object.assign({}, page, {
      path: page.path === `/` ? page.path : page.path.replace(/\/$/, ``),
    });

    if (newPage.path !== page.path) {
      // Remove the old page
      deletePage(page);
      // Add the new page
      createPage(newPage);
    }

    resolve();
  });
};

exports.createPages = ({ actions, createNodeId, graphql }) => {
  const { createPage, createNode } = actions;

  return graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fileAbsolutePath
            html
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    const subslides = sortSlides(getSlides(result)).flatMap(extractSubslides);

    subslides.forEach(({ parentSlide, subslide }, index) => {
      const digest = crypto
        .createHash(`md5`)
        .update(subslide)
        .digest(`hex`);

      createNode({
        id: createNodeId(`${parentSlide.id}_${index} >>> Slide`),
        parent: parentSlide.id,
        children: [],
        internal: {
          type: `Slide`,
          contentDigest: digest,
        },
        html: subslide,
        index: index,
      });

      createPage({
        path: `/${index}`,
        component: path.resolve(`src/templates/slide.js`),
        context: {
          index: index,
          absolutePath: process.cwd() + `/src/slides#${index}`,
        },
      });
    });
  });
};

function getSlides(result) {
  return result.data.allMarkdownRemark.edges;
}

function sortSlides(slides) {
  return [...slides].sort((slideA, slideB) =>
    slideA.node.fileAbsolutePath > slideB.node.fileAbsolutePath ? 1 : -1,
  );
}

function extractSubslides(slide) {
  const subslides = slide.node.html.split('<hr>');

  return subslides.length > 0
    ? subslides.map(subslide => ({
        parentSlide: slide.node,
        subslide,
      }))
    : [
        {
          parentSlide: slide.node,
          subslide: slide.node.html,
        },
      ];
}
