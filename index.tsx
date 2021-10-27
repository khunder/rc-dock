import React, { Component, useRef, useState } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import {DockLayout} from 'rc-dock';
import "rc-dock/dist/rc-dock.css";
import { ExpandOutlined, CompressOutlined, CloseOutlined, CaretDownOutlined } from '@ant-design/icons';
import './style.css';
import { useHotkeys } from 'react-hotkeys-hook';

const TabConent = ({children, style, ...rest}) => {
  const ref = useRef()
  const setFocus = () => ref.current.focus()

  return(
    <div 
      {...rest} 
      ref={ref}
      tabIndex={-1} 
      style={{flex: 1, padding: '5px 10px', ...style}} 
      onMouseDownCapture={setFocus} 
      onTouchStartCapture={setFocus}>
      {children}
    </div>
  )
}

const icons = {
  maximize: <ExpandOutlined style={{fontSize: '12px'}}/>,
  restore: <CompressOutlined style={{fontSize: '12px'}}/>,
  close: <CloseOutlined style={{ fontSize: '12px'}} />,
  more: <CaretDownOutlined style={{ fontSize: '9px'}} />,
}

let groups = {
  'card custom': {
    floatable: true,
    closable: true,
    // animated: false,
    panelExtra: (panelData, context) => {

      console.log(panelData, context)      
      
      return (
        <>
          <span className='my-panel-extra-btn'
                onClick={() => context.dockMove(panelData, null, 'maximize')}>
            {panelData.parent.mode === 'maximize' ? icons.restore : icons.maximize}
          </span>
        </>
      )
    }
  }
};

let tab = {
  title: 'Tab',
  closable: true,
  content: (
    <TabConent>
      <p>Custom component can be added to panel's title bar.</p>
      <p>This panel has a custom maximize button and a close all button</p>
      <form>
        <input type="text"/>
      </form>
    </TabConent>),
  group: 'card custom'
};

let customTab = {
  title: 'custom-style',
  content: (
    <TabConent>
      Custom style
    </TabConent>
  ),
  closable: true,
  // you can mix predefined style with you own style
  // separate 2 styles with space
  // the panel class will contain both dock-style-car and dock-style-custom
  group: 'card custom'
};

let initialLayout = {
  dockbox: {
    mode: 'vertical',
    children: [
      {
        mode: 'horizontal',
        children: [
          {
            tabs: [{...customTab, id: 't10'}, {...customTab, id: 't11'}, {...customTab, id: 't12'}],
          },
          {
            size: 300,
            tabs: [{...tab, id: 't5'}, {...tab, id: 't6'}],
          },
          {
            tabs: [{...customTab, id: 't1'}, {...customTab, id: 't2'}, {...customTab, id: 't3'}],
          },
        ]
      }      
    ]
  },
  floatbox: {
    mode: 'float',
    children: [
      {
        tabs: [
              {id: 't0'},
              {id: 'protect1'}, {id: 't13'}, {id: 't15'}, {id: 't16'},
              {id: 't7'}, {id: 't8'}, {id: 't9'},
          {id: 't2', title: 'Float', content: <TabConent>Float Content</TabConent>, group: 'floatOnly'},
          {id: 't3', title: 'Float', content: <TabConent>Float Content</TabConent>, group: 'floatOnly'}
        ],
        x: 300, y: 150, w: 400, h: 300
      }
    ]
  }
};

const loadTab = (data) => {
  let {id} = data;
  switch (id) {
    case 't0':
      return {...tab, id, group: 'card custom'};
    case 'protect1' :
      return {
        id, title: 'Protect',
        closable: true,
        content: <TabConent>
          <p>Removal of this tab will be rejected</p>
          This is done in the onLayoutChange callback
        </TabConent>,
        group: 'card custom'
      };

  }

  return {
    id, title: id,
    content: <TabConent>Tab Content</TabConent>,
    group: 'card custom'
  };
};

function App(props) {
  const ref = useRef(null);
  const [layout, setLayout] = useState(initialLayout)

  useHotkeys('alt+p', () => {
    ref.current.updateTab('protect1', {id: 'protect1'}, true)
  }, {enableOnTags: ['INPUT', 'SELECT']})

  useHotkeys('alt+m', () => {
    const tab = ref.current.find('protect1')
    ref.current.dockMove(tab.parent, null, 'maximize')
  }, {enableOnTags: ['INPUT', 'SELECT']})

  const onLayoutChange = (newLayout, currentTabId, direction) => {
    if (currentTabId === 'protect1' && direction === 'remove') {
      alert('removal of this tab is rejected');
    } else {
      setLayout(newLayout);
    }
  };

  return (
    <DockLayout 
      ref={ref}
      layout={layout} 
      onLayoutChange={onLayoutChange} 
      loadTab={loadTab} 
      groups={groups}
      style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}}
    />

  )
}

render(<App />, document.getElementById('root'));
