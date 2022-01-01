const isMobile = {
  Android: () => navigator.userAgent.match(/Android/i),
  BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
  IOS: () => navigator.userAgent.match(/IOS/i),
  Opera: () => navigator.userAgent.match(/Opera/i),
  Windows: () => navigator.userAgent.match(/Windows/i),
  any: () =>
    isMobile.Android() ||
    isMobile.BlackBerry() ||
    isMobile.IOS() ||
    isMobile.Opera() ||
    isMobile.Windows(),
};

export default () =>
  isMobile.any()
    ? document.body.classList.add('_touch')
    : document.body.classList.add('_pc');
