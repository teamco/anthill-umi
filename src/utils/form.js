/**
 * @export
 * @param form
 * @param {string} field
 * @param [setter]
 */
export const setComplexValue = (form, field, setter = {}) => {
  const value = { ...form.getFieldValue(field), ...setter };
  form.setFieldsValue({ [field]: value });
};
