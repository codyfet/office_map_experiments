import React from 'react';

export default function withContextMenu(WrappedMapObject, handleObjectContextMenu) {
  return class extends React.Component {
    render() {
      return <WrappedMapObject onContextMenu={handleObjectContextMenu} {...this.props} />;
    }
  };
}