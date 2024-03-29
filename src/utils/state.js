import Logger from '@/core/modules/Logger';

/**
 * @export
 * @param prevProps
 * @param props
 * @param form
 * @param model
 */
export const fillForm = (prevProps, props, form, model) => {
  const entityForm = props[model].entityForm;
  if (JSON.stringify(prevProps[model].entityForm) !==
      JSON.stringify(entityForm)) {
    form.setFields(entityForm);
  }
};

/**
 * @export
 * @param form
 * @param model
 * @param {boolean} [draft]
 */
export const fillFormEffect = (model, form, draft = false) => {
  const entityForm = draft ? model.entityFormDraft : model.entityForm;
  form.setFields(entityForm);
};

/**
 * @export
 * @param form
 * @param ns
 * @param {array} models
 */
export const fillWidgetFormEffect = (models = [], ns, form) => {
  const entityForm = models.map((model, idx) => toEntityForm({ model, ns: ns[idx] }));
  form.setFields(entityForm.flat());
};

/**
 * @export
 * @param entityForm
 * @return {{}}
 */
export const fromForm = (entityForm) => {
  const payload = {};
  entityForm.forEach((form) => (payload[form.name] = form.value));
  return payload;
};

/**
 * @export
 * @param model
 * @param ns
 * @return {*}
 */
export const toEntityForm = ({ model, ns }) => {
  return Object.keys(model).map((key) => ({
    name: ns ? [ns, key] : key,
    value: model[key]
  }));
};

/**
 * @function
 * @param entityForm
 * @param key
 * @param [DEFAULTS]
 * @return {*}
 */
export function getStoredValue(entityForm, key, DEFAULTS = {}) {
  return entityForm[key] || DEFAULTS[key];
}

/**
 * @function
 * @param model
 * @param key
 * @return {*}
 */
export function getFormValue(model, key) {
  let value = undefined;
  model.forEach(_obj => {
    if (_obj?.name === key) {
      value = _obj?.value;
    }
  });

  return value;
}

/**
 * @export
 * @param timestamp
 * @return {string}
 */
export const localeDateTimeString = (timestamp) => {
  const _date = new Date(timestamp);
  return `${_date.toLocaleDateString()} ${_date.toLocaleTimeString()}`;
};

/**
 * @export
 * @param loading
 * @return {*}
 */
export const spinningAll = (loading) => {
  const spinAt = Object.keys(loading.effects).filter(
      (key) => loading.effects[key]
  );
  !!spinAt.length && Logger.global('Loader', 'info', spinAt);
  return !!spinAt.length;
};

/**
 * @export
 * @param loading
 * @return {boolean}
 */
export const spinningGlobal = (loading) => {
  const _globals = Object.keys(loading.effects).filter((key) =>
      key.match(/appModel/)
  );
  const spinAt = _globals.filter((key) => loading.effects[key]).length;
  !!spinAt.length && Logger.global('Loader', 'info', spinAt);
  return !!spinAt.length;
};

/**
 * @export
 * @param loading
 * @return {boolean}
 */
export const spinningLocal = (loading) => {
  const _locals = Object.keys(loading.effects).filter(
      (key) => !key.match(/appModel/)
  );
  const spinAt = _locals.filter((key) => loading.effects[key]);
  !!spinAt.length && Logger.global('Loader', 'info', spinAt);
  return !!spinAt.length;
};
