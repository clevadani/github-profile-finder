import React, { Component } from 'react';

class Item extends Component {
  render() {
    return (
        <li className='list-group-item'>{this.props.target}</li>
    );
  }
}

export default Item;
