/**
 * @constant
 * @export
 * @param filter
 * @param value
 * @param [unit]
 * @return {string}
 */
export const cssFilter = (filter, value, unit = '') =>
  `${filter}(${value}${unit})`;

/**
 * @export
 * @param transform
 * @param value
 * @param [unit]
 * @return {string}
 */
export const cssTransform = (transform, value, unit = '') =>
  `${transform}(${value}${unit})`;

export const cssStyle = (filter, value) => {};

export default {
  filter: cssFilter,
  transform: cssTransform,
};
