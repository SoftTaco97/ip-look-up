import axios from 'axios';
import createMap from '../src/util/map';
import capitalize from '../src/util/capitalize';
import createComponentMounter from './componentMounter';
import AppHeader from '../src/components/AppHeader.vue';
import AppFooter from '../src/components/AppFooter.vue';
import App from '../src/App.vue';

jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({
    status: 200,
    data: [],
  }),
}));
jest.mock('../src/util/map', () => jest.fn().mockReturnValue(jest.fn()));
jest.mock('../src/util/capitalize', () => jest.fn().mockImplementation((str) => str));

describe('App.vue unit tests', () => {
  const mountComponent = createComponentMounter(App);
  let wrapper;

  beforeEach(() => {
    wrapper = mountComponent();
  });

  afterEach(() => {
    wrapper.destroy();
    jest.clearAllMocks();
  });

  describe('rendering unit tests', () => {
    it('Should match the snapshot', () => {
      // ! - Deep mount for snapshots
      wrapper = mountComponent({}, false);
      expect(wrapper).toMatchSnapshot();
    });
    it('Should render properly', () => {
      expect(wrapper.exists()).toEqual(true);
    });
    it('Should have a header and footer ', () => {
      expect(wrapper.findComponent(AppHeader).exists()).toEqual(true);
      expect(wrapper.findComponent(AppFooter).exists()).toEqual(true);
    });
    it('Should display a loading message when there is no ip data', () => {
      expect(wrapper.text()).toEqual(expect.stringContaining('Loading...'));
    });
    it('Should display the ip data', async () => {
      const mockIpData = [
        {
          title: 'IP Address',
          value: '111.111.111.111',
        },
        {
          title: 'Location',
          value: 'Some City, AA, 12345',
        },
        {
          title: 'Timezone',
          value: '-8:00',
        },
        {
          title: 'Internet Service Provider',
          value: 'Comcast sux',
        },
      ];
      await wrapper.setData({ ipData: mockIpData });
      const wrapperText = wrapper.text();
      // Loop through the data and check for it
      mockIpData.forEach(({ title, value }) => {
        expect(wrapperText).toEqual(expect.stringContaining(title));
        expect(wrapperText).toEqual(expect.stringContaining(value));
      });
    });
    it('Should show an error message when an error is encountered', async () => {
      await wrapper.setData({ error: true });
      expect(wrapper.text()).toEqual(expect.stringContaining('Whoops! Can\'t seem to request that IP'));
    });
  });
  describe('method unit tests', () => {
    describe('mapTitle unit tests', () => {
      const mockTitles = { test: 'This is a tes title!' };

      beforeEach(() => wrapper.setData({ titles: mockTitles }));

      it('Should use the value in data.titles when there is one present', () => {
        expect(wrapper.vm.mapTitle('test')).toEqual(mockTitles.test);
      });
      it('Should capitalize the title provided when it is not in data.titles', () => {
        const mockTitle = 'someOtherTitle';
        wrapper.vm.mapTitle(mockTitle);
        expect(capitalize).toHaveBeenCalledTimes(1);
        expect(capitalize).toHaveBeenCalledWith(mockTitle);
      });
    });
    // describe('updateSearch unit tests', () => {});
    // describe('createIpData unit tests', () => {});
    // describe('setMap unit tests', () => {});
    // describe('processIp unit tests', () => {});
    // describe('requestIpData unit tests', () => {});
  });
});
