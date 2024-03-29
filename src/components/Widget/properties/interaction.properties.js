import React from 'react';
import { InputNumber, Radio, Switch, Tooltip } from 'antd';
import {
  BorderBottomOutlined,
  BorderInnerOutlined,
  BorderLeftOutlined,
  BorderRightOutlined,
  BorderTopOutlined,
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
  RedoOutlined
} from '@ant-design/icons';

import i18n from '@/utils/i18n';

/**
 * @function
 * @param title
 * @param icon
 * @param value
 * @return {JSX.Element}
 * @private
 */
function _eventTooltip(title, icon, value) {
  return (
      <Radio.Button value={value}
                    name={value}>
        <Tooltip title={i18n.t(title)}>
          {icon}
        </Tooltip>
      </Radio.Button>
  );
}

/**
 * @export
 * @param onChange
 * @return {*}
 */
export const interactionProperties = ({ onChange }) => {
  const interactions = [
    [
      (
          <Switch name={['behavior', 'overlapping']}
                  config={{ valuePropName: 'checked' }}
                  label={i18n.t('widget:overlapping')}
                  key={'widgetOverlapping'}
                  onChange={() => onChange('overlapping')} />
      ),
      (
          <Switch name={['behavior', 'alwaysOnTop']}
                  config={{ valuePropName: 'checked' }}
                  label={i18n.t('widget:alwaysOnTop')}
                  key={'widgetAlwaysOnTop'}
                  onChange={() => onChange('alwaysOnTop')} />
      ),
      (
          <Switch name={['behavior', 'freeze']}
                  config={{ valuePropName: 'checked' }}
                  label={i18n.t('widget:freeze')}
                  key={'widgetFreeze'}
                  onChange={() => onChange('freeze')} />
      )
    ],
    [
      (
          <Switch name={['behavior', 'draggable']}
                  config={{ valuePropName: 'checked' }}
                  label={i18n.t('widget:draggable')}
                  key={'widgetDraggable'}
                  onChange={() => onChange('draggable')} />
      ),
      (
          <Switch name={['behavior', 'resizable']}
                  config={{ valuePropName: 'checked' }}
                  label={i18n.t('widget:resizable')}
                  key={'widgetResizable'}
                  onChange={() => onChange('resizable')} />
      ),
      (
          <Switch name={['behavior', 'scrollable']}
                  config={{ valuePropName: 'checked' }}
                  label={i18n.t('widget:scrollable')}
                  key={'widgetScrollable'}
                  onChange={() => onChange('scrollable')} />
      )
    ],
    [
      (
          <Switch name={['behavior', 'maximizable']}
                  config={{ valuePropName: 'checked' }}
                  label={i18n.t('widget:maximizable')}
                  key={'widgetMaximizable'}
                  onChange={() => onChange('maximizable')} />
      ),
      (
          <Switch name={['behavior', 'zoomable']}
                  config={{ valuePropName: 'checked' }}
                  label={i18n.t('widget:zoomable')}
                  key={'widgetZoomable'}
                  onChange={() => onChange('zoomable')} />
      ),
      (
          <InputNumber min={0}
                       max={10000}
                       label={i18n.t('widget:setLayer')}
                       key={'widgetSetLayerUp'}
                       name={['behavior', 'setLayerUp']}
                       onChange={() => onChange('setLayerUp')} />
      )
    ]
  ];

  const dimensions = [
    [
      (
          <InputNumber min={0}
                       max={10000}
                       label={i18n.t('widget:cellOffset')}
                       key={'widgetCellOffset'}
                       name={['behavior', 'cellOffset']}
                       onChange={() => onChange('cellOffset')} />
      ),
      (
          <InputNumber min={0}
                       max={10000}
                       label={i18n.t('widget:rowOffset')}
                       key={'widgetRowOffset'}
                       name={['behavior', 'rowOffset']}
                       onChange={() => onChange('rowOffset')} />
      )
    ],
    [
      (
          <InputNumber min={0}
                       max={10000}
                       label={i18n.t('widget:cellWidth')}
                       key={'widgetCellWidth'}
                       name={['behavior', 'cellWidth']}
                       onChange={() => onChange('cellWidth')} />
      ),
      (
          <InputNumber min={0}
                       max={10000}
                       label={i18n.t('widget:rowHeight')}
                       key={'widgetRowHeight'}
                       name={['behavior', 'rowHeight']}
                       onChange={() => onChange('rowHeight')} />
      )
    ],
    [
      (
          <Switch name={['behavior', 'stretchWidth']}
                  label={i18n.t('widget:stretchWidth')}
                  key={'widgetStretchWidth'}
                  config={{ valuePropName: 'checked' }}
                  onChange={() => onChange('stretchWidth')} />
      ),
      (
          <Switch name={['behavior', 'stretchHeight']}
                  config={{ valuePropName: 'checked' }}
                  label={i18n.t('widget:stretchHeight')}
                  key={'widgetStretchHeight'}
                  onChange={() => onChange('stretchHeight')} />
      )
    ],
    [
      (
          <Radio.Group buttonStyle={'solid'}
                       name={['behavior', 'unstick']}
                       label={i18n.t('widget:unStickLabel')}
                       key={'widgetUnstick'}
                       onChange={() => onChange('unstick')}>
            <Radio.Button value={'unstick'}>
              <RedoOutlined />
              {i18n.t('widget:unStick')}
            </Radio.Button>
          </Radio.Group>
      ),
      (
          <Radio.Group buttonStyle={'solid'}
                       name={['behavior', 'stick']}
                       label={i18n.t('widget:stick')}
                       key={'widgetStick'}
                       onChange={e => onChange(e.target.value)}>
            <div style={{ marginBottom: 2 }}>
              {_eventTooltip('widget:stickToTopLeft', <RadiusUpleftOutlined />, 'stickToTopLeft')}
              {_eventTooltip('widget:stickToCenterTop', <BorderTopOutlined />, 'stickToCenterTop')}
              {_eventTooltip('widget:stickToTopRight', <RadiusUprightOutlined />, 'stickToTopRight')}
            </div>
            <div style={{ marginBottom: 2 }}>
              {_eventTooltip('widget:stickToCenterLeft', <BorderLeftOutlined />, 'stickToCenterLeft')}
              {_eventTooltip('widget:stickToCenter', <BorderInnerOutlined />, 'stickToCenter')}
              {_eventTooltip('widget:stickToCenterRight', <BorderRightOutlined />, 'stickToCenterRight')}
            </div>
            <div style={{ marginBottom: 2 }}>
              {_eventTooltip('widget:stickToBottomLeft', <RadiusBottomleftOutlined />, 'stickToBottomLeft')}
              {_eventTooltip('widget:stickToCenterBottom', <BorderBottomOutlined />, 'stickToCenterBottom')}
              {_eventTooltip('widget:stickToBottomRight', <RadiusBottomrightOutlined />, 'stickToBottomRight')}
            </div>
          </Radio.Group>
      )
    ]
  ];

  return {
    dimensions,
    interactions
  };
};
