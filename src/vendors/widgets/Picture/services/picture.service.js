import filter from '@/vendors/widgets/Picture/config/picture.filter';

/**
 * @export
 * @param style
 * @param filterType
 * @param payload
 * @return {string}
 */
export const handleMultipleFilters = ({ style, filterType, payload }) => {
  let _selectedFilters = [];
  const newFilter = filter[filterType](
      payload[filterType],
      payload.value,
      payload.unit
  );

  const _filter = style[filterType];

  if (_filter) {
    const idx = findFilterIdx(style, payload, filterType);

    _selectedFilters = _filter.split(' ');

    idx > -1 ?
        (_selectedFilters[idx] = newFilter) :
        _selectedFilters.push(newFilter);
  } else {
    _selectedFilters.push(newFilter);
  }

  return _selectedFilters.join(' ');
};

/**
 * @export
 * @param style
 * @param payload
 * @param filterType
 * @return {number}
 */
export const findFilterIdx = (style, payload, filterType) => {
  const _filter = style[filterType]?.split(' ');
  let idx = -1;
  _filter && _filter.forEach((filter, key) => {
    if (filter.match(payload[filterType])) {
      idx = key;
    }
  });

  return idx;
};
