import React from 'react';

import MenuButton from './MenuButton';

class Sidebar extends React.Component {
  componentDidMount() {
    if (this.props.rehomeControls) {
      const { position } = this.props;
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

      controls.forEach((control) => this.rootElement?.appendChild(control));
    }
  }

  onClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.onClose) {
      this.props.onClose(e);
    }
  };

  onOpen = (e, tabid) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.onOpen) {
      this.props.onOpen(tabid);
    }
  };

  renderPanes(children) {
    return React.Children.map(children, (p) =>
      React.cloneElement(p, {
        onClose: this.onClose.bind(this),
        closeIcon: this.props.closeIcon,
        active: p.props.id === this.props.selected,
        position: this.props.position || 'left',
      })
    );
  }

  render() {
    const position = ` sidebar-${this.props.position || 'left'}`;
    const collapsed = this.props.collapsed ? ' collapsed' : '';
    const tabs = React.Children.toArray(this.props.children);
    const bottomtabs = tabs.filter((t) => t.props.anchor === 'bottom');
    const toptabs = tabs.filter((t) => t.props.anchor !== 'bottom');

    return (
      <div
        id={this.props.id || 'leaflet-sidebar'}
        className={`sidebar leaflet-touch${position}${collapsed}`}
        ref={(el) => {
          this.rootElement = el;
        }}
      >
        <div className='sidebar-tabs'>
          <ul role='tablist'>
            {toptabs.map((t) => (
              <MenuButton
                key={t.props.id}
                id={t.props.id}
                icon={t.props.icon}
                disabled={t.props.disabled}
                selected={this.props.selected}
                collapsed={this.props.collapsed}
                onClose={this.onClose}
                onOpen={this.onOpen}
                map={this.props.map || null}
              />
            ))}
          </ul>
          <ul role='tablist'>
            {bottomtabs.map((t) => (
              <MenuButton
                key={t.props.id}
                id={t.props.id}
                icon={t.props.icon}
                disabled={t.props.disabled}
                selected={this.props.selected}
                collapsed={this.props.collapsed}
                onClose={this.onClose}
                onOpen={this.onOpen}
                map={this.props.map || null}
              />
            ))}
          </ul>
        </div>
        <div className='sidebar-content'>
          {this.renderPanes(this.props.children)}
        </div>
      </div>
    );
  }
}

export default Sidebar;
