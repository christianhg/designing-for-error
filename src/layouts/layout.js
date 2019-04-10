import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { TemplateWrapper } from './template-wrapper';

import './index.css';

export const Layout = ({ children, location, slideIndex }) => (
  <StaticQuery
    query={graphql`
      query IndexQuery {
        allSlide {
          edges {
            node {
              id
            }
          }
        }
      }
    `}
    render={data => {
      const slidesLength = data.allSlide.edges.length;
      return (
        <TemplateWrapper
          location={location}
          slideIndex={slideIndex}
          slidesLength={slidesLength}
        >
          {children}
        </TemplateWrapper>
      );
    }}
  />
);
