import React, { Component } from 'react';
import { TweenMax } from 'gsap';

export default class FadeUpContainer extends Component {
  componentWillEnter(callback) {
    const { delayEnter } = this.props;
    const el = this.container;
    TweenMax.fromTo(
      el,
      0.5,
      { opacity: 0 },
      { opacity: 1, onComplete: callback, delay: delayEnter },
    );
  }

  componentWillLeave(callback) {
    const { delayLeave } = this.props;
    const el = this.container;
    TweenMax.fromTo(
      el,
      0.5,
      { opacity: 1 },
      { opacity: 0, onComplete: callback, delay: delayLeave },
    );
  }

  render() {
    const { selectAllOrdersWorkOfMenuItem, item, children } = this.props;
    return <div ref={c => (this.container = c)}>{children}</div>;
  }
}
