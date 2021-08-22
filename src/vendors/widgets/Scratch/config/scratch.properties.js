import { Input } from 'antd';
import i18n from '@/utils/i18n';
import React from 'react';

/**
 * @export
 * @return {*[]}
 */
export const scratchProperties = () => {
  return [
    [
      <Input type={'text'}
             label={i18n.t('form:name')}
             name={['scratch', 'text']}
             key={'scratchText'} />
    ]
  ];
};
