/**
 * Helper for creating the stubs needed for the component
 * @param { Array[String] } components
 * @return { Object }
 */
export default (components) => components.reduce((stubs, component) => {
  // eslint-disable-next-line no-param-reassign
  stubs[component] = { template: '<div></div>' };
  return stubs;
}, {});
