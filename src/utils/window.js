/**
 * @export
 * @param onActiveTab
 */
export const handleActiveTab = onActiveTab => {
  window.addEventListener('focus', () => onActiveTab(true));
  window.addEventListener('blur', () => onActiveTab(false));
};

/**
 * @export
 * @param {string} id
 */
export const scrollToRef = ({id}) => {
  const ref = document.querySelector(`#${id}`);
  ref && ref.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
};