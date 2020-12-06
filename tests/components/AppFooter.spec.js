import createComponentMounter from '../componentMounter';
import AppFooter from '../../src/components/AppFooter.vue';

describe('src/components/AppFooter.vue unit tests', () => {
  const mountComponent = createComponentMounter(AppFooter);
  let wrapper;

  beforeEach(() => {
    wrapper = mountComponent();
  });

  afterEach(() => wrapper.destroy());

  describe('rendering unit tests', () => {
    it('Should match the snapshot', () => {
      // ! - Deep mount for snapshots
      wrapper = mountComponent({}, false);
      expect(wrapper).toMatchSnapshot();
    });
    it('Should the proper information', () => {
      const html = wrapper.html();
      expect(html).toEqual(expect.stringContaining('Jared Martinez'));
      expect(html).toEqual(expect.stringContaining(new Date().getFullYear().toString()));
    });
  });
});
