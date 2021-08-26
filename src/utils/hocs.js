import React from 'react';

/**
 * @export
 * @param element
 * @param props
 * @param children
 * @return {React.DetailedReactHTMLElement<*, HTMLElement>}
 */
export const reactClone = (element, props, children = null) => {
  return React.cloneElement(element, { ...props }, children);
};
