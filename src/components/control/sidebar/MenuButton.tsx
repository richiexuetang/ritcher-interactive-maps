import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MenuButton = (props: any) => {
  const icon =
    props.icon === 'string' ? <i className={props.icon} /> : props.icon;
  const active =
    props.id === props.selected && !props.collapsed ? ' active' : '';
  const disabled = props.disabled ? ' disabled' : '';

  const onClick = (e: React.MouseEvent, id: string) => {
    if (!props.disabled) {
      if (props.collapsed) {
        props.onOpen(e, id);
      } else {
        if (props.selected === id) {
          props.onClose(e);
        } else {
          props.onOpen(e, id);
        }
      }
    }
  };

  return (
    <li className={active + disabled} key={props.id}>
      <button
        className='sidebar-tab-button'
        role='tab'
        onClick={(e) => onClick(e, props.id)}
      >
        {icon}
      </button>
    </li>
  );
};

export default MenuButton;
