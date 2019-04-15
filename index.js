import React, { Component } from 'react';
import './index.css';

const position = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0
};

class Editor extends Component {
  state = {
    isActive: false,
    resizing: false,
    placeholderPosition: { ...position },
    boxPosition: { ...position }
  };

  handleContainerClick = () => {
    this.setState({ isActive: true });
  };

  handleResizeButtonMouseDown = allowedPositions => e => {
    this.pageX = e.pageX;
    this.pageY = e.pageY;

    document.body.style.cursor = getComputedStyle(e.target).cursor;

    const mouseMoveCb = this.resize(allowedPositions);

    document.addEventListener('mousemove', mouseMoveCb);
    document.addEventListener('mouseup', this.handleMouseUp(mouseMoveCb));

    this.setState({
      resizing: true
    });
  };

  handleMouseUp = cb => e => {
    document.removeEventListener('mousemove', cb);
    document.body.style.cursor = 'default';

    const { placeholderPosition, boxPosition } = this.state;

    this.pageX = null;
    this.pageY = null;

    this.setState({
      resizing: false,
      boxPosition: {
        top: boxPosition.top + placeholderPosition.top,
        right: boxPosition.right + placeholderPosition.right,
        left: boxPosition.left + placeholderPosition.left,
        bottom: boxPosition.bottom + placeholderPosition.bottom
      },
      placeholderPosition: { ...position }
    });
  };

  resize = allowedPositions => e => {
    const { pageX: newPageX, pageY: newPageY } = e;
    const { placeholderPosition } = this.state;

    this.setState({
      placeholderPosition: {
        ...placeholderPosition,
        top: allowedPositions.includes('top')
          ? -(this.pageY - newPageY)
          : placeholderPosition.top,
        right: allowedPositions.includes('right')
          ? -(newPageX - this.pageX)
          : placeholderPosition.right,
        bottom: allowedPositions.includes('bottom')
          ? this.pageY - newPageY
          : placeholderPosition.bottom,
        left: allowedPositions.includes('left')
          ? newPageX - this.pageX
          : placeholderPosition.left
      }
    });
  };

  render() {
    const { isActive, resizing, placeholderPosition, boxPosition } = this.state;

    return (
      <div className="container">

        <div
          className="editor"
          style={{
            border: isActive ? '2px solid #5995f2' : '1px solid #565555',
            ...boxPosition
          }}
          onClick={this.handleContainerClick}
        >
          {isActive && (
            <>
              <div className="rotate" />
              <div className="col" />

              <div
                className="resize-button top-left"
                onMouseDown={this.handleResizeButtonMouseDown(['top', 'left'])}
              />
              <div
                className="resize-button top-center"
                onMouseDown={this.handleResizeButtonMouseDown(['top'])}
              />
              <div
                className="resize-button top-right"
                onMouseDown={this.handleResizeButtonMouseDown(['top', 'right'])}
              />
              <div
                className="resize-button right-center"
                onMouseDown={this.handleResizeButtonMouseDown(['right'])}
              />
              <div
                className="resize-button bottom-right"
                onMouseDown={this.handleResizeButtonMouseDown([
                  'bottom',
                  'right'
                ])}
              />
              <div
                className="resize-button bottom-center"
                onMouseDown={this.handleResizeButtonMouseDown(['bottom'])}
              />
              <div
                className="resize-button bottom-left"
                onMouseDown={this.handleResizeButtonMouseDown([
                  'bottom',
                  'left'
                ])}
              />
              <div
                className="resize-button left-center"
                onMouseDown={this.handleResizeButtonMouseDown(['left'])}
              />
            </>
          )}
          {resizing && (
            <div
              style={{
                border: '1px solid #4c5056',
                position: 'absolute',
                ...placeholderPosition
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Editor;
