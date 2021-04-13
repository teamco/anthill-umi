/**
 * Password strength estimator inspired by password crackers
 * @link https://github.com/dropbox/zxcvbn
 * @type {function(*=, *): *}
 */
const zxcvbn = require('zxcvbn');

/**
 * @constant
 * @param e
 * @param setMeterText
 * @param setMeterValue
 */
export const onUpdateMeter = ({ e, setMeterValue, setMeterText }) => {
  const value = e.target.value;

  /**
   * @constant
   * @type {{score}}
   */
  const result = zxcvbn(value);

  // Update the password strength meter
  setMeterValue(value.length ? result.score : null);

  // Update the text indicator
  setMeterText(value.length ? result.score : '');
};
