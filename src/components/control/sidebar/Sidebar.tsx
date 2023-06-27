/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react';

import MenuButton from './MenuButton';

interface SidebarPropsType {
  rehomeControls: any;
  position: any;
  onClose: any;
  onOpen: any;
  closeIcon: any;
  selected: any;
  collapsed: boolean;
  id: any;
  map: any;
}

const Sidebar: React.FC<PropsWithChildren<SidebarPropsType>> = (props) => {
  const [rootElement, setRootElement] = useState<any>(null);

  useEffect(() => {
    if (props.rehomeControls) {
      const { position } = props;
      const selector = `.leaflet-${position}`;
      const controls = document.querySelectorAll(selector);
      const topControl = document.querySelector(`.leaflet-top${selector}`);
      const bottomControl = document.querySelector(
        `.leaflet-bottom${selector}`
      );

      topControl?.classList.add(`rehomed-top-${position}`);
      bottomControl?.classList.add(`rehomed-bottom-${position}`);

      // Exception: Attribution control should not ever be rehomed (in my opinion):
      const attributionControl = document.querySelector(
        `${selector} .leaflet-control-attribution`
      );
      if (attributionControl) {
        const backupOriginalHome = document.createElement('div');
        const leafletControlContainer = document.querySelector(
          '.leaflet-control-container'
        );
        backupOriginalHome.classList.add(`leaflet-${position}`);
        backupOriginalHome.classList.add('leaflet-bottom');
        backupOriginalHome.appendChild(attributionControl);
        leafletControlContainer?.appendChild(backupOriginalHome);
      }

      controls.forEach((control) => rootElement?.appendChild(control));
    }
  });

  const onClose = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.onClose) {
      props.onClose(e);
    }
  };

  const onOpen = (e: any, tabid: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.onOpen) {
      props.onOpen(tabid);
    }
  };

  const renderPanes = (children: any) => {
    return React.Children.map(children, (p) =>
      React.cloneElement(p, {
        onClose: onClose.bind(this),
        closeIcon: props.closeIcon,
        active: p.props.id === props.selected,
        position: props.position || 'left',
      })
    );
  };

  const position = ` sidebar-${props.position || 'left'}`;
  const collapsed = props.collapsed ? ' collapsed' : '';
  const tabs: ReactElement[] | any = React.Children.toArray(props.children);
  const bottomtabs = tabs.filter((t: any) => t.props.anchor === 'bottom');
  const toptabs = tabs.filter((t: any) => t.props.anchor !== 'bottom');

  return (
    <div
      id={props.id || 'leaflet-sidebar'}
      className={`sidebar leaflet-touch${position}${collapsed}`}
      ref={(el) => setRootElement(el)}
    >
      <div className='sidebar-tabs'>
        <ul role='tablist'>
          {toptabs.map((t: any) => (
            <MenuButton
              key={t.props.id}
              id={t.props.id}
              icon={t.props.icon}
              disabled={t.props.disabled}
              selected={props.selected}
              collapsed={props.collapsed}
              onClose={onClose}
              onOpen={onOpen}
              map={props.map || null}
            />
          ))}
        </ul>
        <ul role='tablist'>
          {bottomtabs.map((t: any) => (
            <MenuButton
              key={t.props.id}
              id={t.props.id}
              icon={t.props.icon}
              disabled={t.props.disabled}
              selected={props.selected}
              collapsed={props.collapsed}
              onClose={onClose}
              onOpen={onOpen}
              map={props.map || null}
            />
          ))}
        </ul>
      </div>
      <div className='sidebar-content'>{renderPanes(props.children)}</div>
    </div>
  );
};

export default Sidebar;
