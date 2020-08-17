import { Component } from 'react';
import PropTypes from 'prop-types';

import './ButtonList.css';
// import { buttonListItemType } from '../../types/propTypes';

class ButtonList extends Component {
  // static propTypes = {
  // 	items: PropTypes.arrayOf(buttonListItemType),
  // 	className: PropTypes.string,
  // };

  render() {
    const { items = [], className } = this.props;

    return (
      <div className={`button-list ${className}`}>
        {items.map((item, i) => (
          <div
            onClick={() =>
              typeof item.onClick === 'function' && item.onClick(item)
            }
            onTouchStart={() =>
              typeof item.onButtonDown === 'function' && item.onButtonDown(item)
            }
            onTouchEnd={() =>
              typeof item.onButtonUp === 'function' && item.onButtonUp(item)
            }
            onMouseDown={() =>
              typeof item.onButtonDown === 'function' && item.onButtonDown(item)
            }
            onMouseUp={() =>
              typeof item.onButtonUp === 'function' && item.onButtonUp(item)
            }
            className={`button-list__item
            ${item.isActive ? 'button-list__item--active' : ''}`}
            key={`button-list-${i}`}
          >
            {item.name}
          </div>
        ))}
      </div>
    );
  }
}

export default ButtonList;
