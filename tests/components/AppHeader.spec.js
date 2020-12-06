import createComponentMounter from '../componentMounter';
import createStubs from '../createStubs';
import AppHeader from '../../src/components/AppHeader.vue';

describe('src/components/AppHeader.vue unit tests', () => {
  const stubs = createStubs(['SearchForm']);
  const mountComponent = createComponentMounter(AppHeader, {
    stubs,
    propsData: {
      loading: false,
      userSearch: '',
    },
  });
  let wrapper;

  beforeEach(() => {
    wrapper = mountComponent();
  });

  afterEach(() => wrapper.destroy());

  describe('Rendering unit tests', () => {
    it('Should match the snapshot', () => {
      // ! - Deep mount for snapshots
      wrapper = mountComponent({}, false);
      expect(wrapper).toMatchSnapshot();
    });
    it('Should have a main title', () => {
      expect(wrapper.html()).toEqual(expect.stringContaining('IP Address Look Up'));
    });
  });
  describe('Method unit tests', () => {
    describe('updateSearch unit tests', () => {
      it('Should emit the update-search event with the value provided', () => {
        wrapper.vm.updateSearch('test');
        expect(wrapper.emitted()['update-search']).toBeTruthy();
        expect(wrapper.emitted()['update-search'][0]).toEqual(['test']);
      });
    });
    describe('requestIpData unit tests', () => {
      it('Should emit the submit event', () => {
        wrapper.vm.requestIpData();
        expect(wrapper.emitted().submit).toBeTruthy();
      });
    });
  });
});
