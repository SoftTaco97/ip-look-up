import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';

/**
 * Curried function for mounting a component for testing
 * @param { Component } component component to mount
 * @param { Object } initialOptions options to mount all the time
 * @return { Function } Function for mounting the component
 */
export default (component, intialOptions) => {
  const vuetify = new Vuetify();
  const localVue = createLocalVue();
  /**
   * Function for mounting a component
   * @param { Object } options options to use in this specific mount
   * @param { Boolean } shallow whether to mount the component all the way
   * @return { HTMLElement } Rendered component
   */
  return (options = {}, shallow = true) => {
    const mountOptions = [component, {
      localVue,
      vuetify,
      ...intialOptions,
      ...options,
    }];

    return shallow ? shallowMount(...mountOptions) : mount(...mountOptions);
  };
};
