const path = require('path');
const crypto = require('crypto');
const _ = require('lodash');

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

    const slides = sortSlides(getSlides(result)).flatMap(slide =>
      slide.node.html.split('<hr>').map(html => ({
        node: slide.node,
        html,
      })),
    );

    slides.forEach(({ node, html }, index) => {
      const digest = crypto
        .createHash(`md5`)
        .update(html)
        .digest(`hex`);

      createNode({
        id: createNodeId(`${node.id}_${index} >>> Slide`),
        parent: node.id,
        children: [],
        internal: {
          type: `Slide`,
          contentDigest: digest,
        },
        html: html,
        index: index,
      });
    });

    slides.forEach((slide, index) => {
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
