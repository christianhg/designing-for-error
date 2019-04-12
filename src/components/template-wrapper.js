import React, { Component } from 'react';
import { navigate } from 'gatsby';
import Swipeable from 'react-swipeable';
import { Transition } from './transition';
import { Header } from './header';

export class TemplateWrapper extends Component {
  NEXT = [13, 32, 39];
  PREV = 37;

  swipeLeft = () => {
    this.navigate({ keyCode: this.NEXT[0] });
  };

  swipeRight = () => {
    this.navigate({ keyCode: this.PREV });
  };

  navigate = ({ keyCode }) => {
    const slideIndex = this.props.slideIndex;
    const slidesLength = this.props.slidesLength;

    if (keyCode === this.PREV && slideIndex === 0) {
      return false;
    } else if (
      this.NEXT.indexOf(keyCode) !== -1 &&
      slideIndex === slidesLength - 1
    ) {
      return false;
    } else if (this.NEXT.indexOf(keyCode) !== -1) {
      navigate(`/${slideIndex + 1}`);
    } else if (keyCode === this.PREV) {
      navigate(`/${slideIndex - 1}`);
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.navigate);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.navigate);
  }

  render() {
    const { location, children } = this.props;

    return (
      <div>
        <Header />
        <Swipeable
          onSwipedLeft={this.swipeLeft}
          onSwipedRight={this.swipeRight}
        >
          <Transition location={location}>
            <div id="slide" style={{ width: '100%' }}>
              {children}
            </div>
          </Transition>
        </Swipeable>
      </div>
    );
  }
}
