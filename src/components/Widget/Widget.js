import React, { createRef } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import { ResizableBox } from 'react-resizable';
import { SettingOutlined } from '@ant-design/icons';

import { useDrag } from 'react-dnd';
import classnames from 'classnames';

import { itemTypes } from '@/pages/website/mode/development/itemTypes';
import widgets from '@/components/Widget/widget.list';
import styles from '@/components/Widget/widget.module.less';
import '@/components/Widget/resizable.less';

const MIN_OPACITY = 0.2;
const MAX_OPACITY = 1;

/**
 * @export
 * @param props
 * @return {JSX.Element|null|{isDragging: boolean}}
 * @constructor
 */
const Widget = props => {
  let [{ isDragging }, drag] = [{ isDragging: false }, createRef()];

  const {
    widgetProps,
    onInitFormDraft,
    onPropertiesModalVisibility,
    onSetActiveWidget,
    onResizeStop,
    onResize,
    onSetOpacity,
    onHideContent,
    updateForm,
    contentModel
  } = props;

  const {
    name,
    description,
    contentKey,
    offset,
    dimensions
  } = widgetProps;

  const position = {
    left: offset.x || 0,
    top: offset.y || 0
  };

  const { widgetsForm } = contentModel;

  const widgetForm = widgetsForm[contentKey];

  const {
    hideContent,
    opacity,
    hideContentOnInteraction,
    draggable,
    resizable,
    stick
  } = widgetForm.properties;

  // const _onStart = () => {
  //   onSetActiveWidget(widgetProps);
  //   widgetHideContentOnInteraction ?
  //       onHideContent(true) :
  //       onSetOpacity(MIN_OPACITY);
  // };
  //
  // const _onStop = () => {
  //   onSetActiveWidget(undefined);
  //   widgetHideContentOnInteraction ?
  //       onHideContent(false) :
  //       onSetOpacity(MAX_OPACITY);
  // };

  if (draggable) {
    // [{ isDragging }, drag] = useDrag({
    //   item: {
    //     name,
    //     type: itemTypes.WIDGET
    //   },
    //   begin(monitor) {
    //     _onStart();
    //   },
    //   end(item, monitor) {
    //     const dropResult = monitor.getDropResult();
    //     if (item && dropResult) {
    //       _onStop();
    //     }
    //   },
    //   collect(monitor) {
    //     return {
    //       isDragging: monitor.isDragging()
    //     };
    //   }
    // });
  }

  const widget = widgets[name];
  const stickTo = stick ?
      classnames(styles.stickTo, styles[stick]) : '';

  const style = {
    ...position,
    ...dimensions,
    opacity
  };

  const card = (
      <div name={name}
           id={`widget-${contentKey}`}
           ref={drag}
           className={classnames(styles.widget, stickTo)}
           style={style}>
        <Card hoverable
              bordered={false}
              className={styles.widgetCard}
              actions={[
                <SettingOutlined key={'setting'}
                                 onClick={() => {
                                   onPropertiesModalVisibility(true, contentKey);
                                 }} />
              ]}
              cover={(
                  <div style={{ height: '100%' }}>
                    <div className={styles.interactionHide} />
                    <div style={hideContent ? { display: 'none' } : null}>
                      {React.cloneElement(widget, {
                        opts: { name, contentKey }
                      })}
                    </div>
                  </div>
              )}>
        </Card>
      </div>
  );

  // return widget ? resizable ? (
  // <ResizableBox className={classnames(styles.widget, styles[mode])}
  //               style={{ ...position }}
  //               onResize={(e, data) => {
  //                 _onStart();
  //                 onResize(data, widgetProps);
  //               }}
  //               onResizeStop={(e, data) => {
  //                 _onStop();
  //                 onResizeStop(data, widgetProps);
  //               }}
  //               width={dimensions.width}
  //               height={dimensions.height}
  //               resizeHandles={['se']}>
  //   {card}
  // </ResizableBox>
  // ) : card : null;
  return widget ? card : null;
};

export default connect(({
      contentModel,
      loading
    }) => ({
      contentModel,
      loading
    }),
    dispatch => ({
      dispatch,
      onPropertiesModalVisibility(visible, contentKey) {
        dispatch({
          type: 'contentModel/propertiesModalVisibility',
          payload: { contentKey, visible }
        });
      },
      onInitFormDraft(model) {
        dispatch({
          type: `contentModel/initFormDraft`,
          payload: { model }
        });
      },
      onSetOpacity(opacity) {
        dispatch({
          type: 'contentModel/setOpacity',
          payload: { opacity }
        });
      },
      onHideContent(hide) {
        dispatch({
          type: 'contentModel/hideContent',
          payload: { hide }
        });
      },
      onSetActiveWidget(widget) {
        dispatch({
          type: 'pageModel/setActiveWidget',
          payload: { widget }
        });
      }
    })
)(withTranslation()(Widget));
