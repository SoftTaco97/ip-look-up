import axios from 'axios';
import createMap from '../src/util/map';
import capitalize from '../src/util/capitalize';
import createComponentMounter from './componentMounter';
import createStubs from './createStubs';
import App from '../src/App.vue';

jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({
    status: 200,
    data: [],
  }),
}));
jest.mock('../src/util/map', () => jest.fn().mockReturnValue(jest.fn()));
jest.mock('../src/util/capitalize', () => jest.fn().mockImplementation((str) => str));

describe('src/App.vue unit tests', () => {
  const stubs = createStubs(['AppFooter', 'AppHeader']);
  const mountComponent = createComponentMounter(App, { stubs });
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
      const mockTitles = { test: 'This is a test title!' };

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
    describe('updateSearch unit tests', () => {
      it('Should assign userSearch to the value', () => {
        const mockSearch = 'test.com';
        wrapper.vm.updateSearch(mockSearch);
        expect(wrapper.vm.userSearch).toEqual(mockSearch);
      });
    });
    describe('createIpData unit tests', () => {
      const mockData = {
        location: {
          city: 'someCity',
          region: 'someRegion',
          postalCode: 'someCode',
          timezone: 'someTimezone',
        },
        ip: 'someIp',
        isp: 'someIsp',
      };
      let ipData;
      beforeEach(() => {
        // spy on the mapTitle method
        jest.spyOn(wrapper.vm, 'mapTitle').mockImplementation((word) => word);
        ipData = wrapper.vm.createIpData(mockData);
      });
      it('Should include all the proper data', () => {
        const { location, ...otherData } = mockData; // don't test location - this changes.
        Object.entries(otherData).forEach(([key, value]) => {
          const dataIndex = ipData.findIndex(({ title }) => title === key);
          const entry = ipData[dataIndex];
          expect(entry).not.toEqual(undefined);
          expect(entry.title).toEqual(key);
          expect(entry.value).toEqual(value);
        });
      });
      it('Should create a useable location string', () => {
        const mockLocation = `${mockData.location.city}, ${mockData.location.region} ${mockData.location.postalCode}`;
        expect(ipData[1].value).toEqual(mockLocation);
      });
      it('Should map all the titles', () => {
        const dataKeys = ['ip', 'isp', 'location', 'timezone'];
        expect(wrapper.vm.mapTitle).toHaveBeenCalledTimes(dataKeys.length);
        dataKeys.forEach((key) => expect(wrapper.vm.mapTitle).toHaveBeenCalledWith(key));
      });
    });
    describe('setMap unit tests', () => {
      const mockData = { lat: 1, lng: 3 };
      it('Should create the map when a map has not been created', () => {
        wrapper.vm.setMap(mockData);
        expect(createMap).toHaveBeenCalledTimes(1);
        expect(createMap).toHaveBeenCalledWith(mockData.lat, mockData.lng);
        expect(wrapper.vm.updateMap).toEqual(createMap.mock.results[0].value);
      });
      it('Should update the map when a map has been created', async () => {
        await wrapper.setData({ updateMap: jest.fn() });
        wrapper.vm.setMap(mockData);
        expect(wrapper.vm.updateMap).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.updateMap).toHaveBeenCalledWith(mockData.lat, mockData.lng);
      });
      it('Should use an empty object when nothing is passed in', () => {
        wrapper.vm.setMap();
        expect(createMap).toHaveBeenCalledTimes(1);
        expect(createMap).toHaveBeenCalledWith(undefined, undefined);
      });
    });
    describe('processIp unit tests', () => {
      const mockData = {
        location: 'someLocation',
        isp: 'someIsp',
        ip: 'someIp',
      };
      beforeEach(() => {
        jest.spyOn(wrapper.vm, 'setMap').mockReturnValue(null);
        jest.spyOn(wrapper.vm, 'updateSearch');
        jest.spyOn(wrapper.vm, 'requestIpData').mockReturnValue(mockData);
        return wrapper.vm.processIp();
      });
      it('Should get the ip data from the api', () => {
        expect(wrapper.vm.requestIpData).toHaveBeenCalledTimes(1);
      });
      it('Should update the search property when it is not set', () => {
        expect(wrapper.vm.updateSearch).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.updateSearch).toHaveBeenCalledWith(mockData.ip);
      });
      it('Should not update the search property when it is set', async () => {
        jest.clearAllMocks();
        await wrapper.setData({ userSearch: 'ip' });
        await wrapper.vm.processIp();
        expect(wrapper.vm.updateSearch).not.toHaveBeenCalled();
      });
      it('Should indicate to a user that an error occured when there was one', async () => {
        jest.clearAllMocks();
        wrapper.vm.requestIpData.mockRejectedValue(new Error('test'));
        await wrapper.vm.processIp();
        expect(wrapper.vm.error).toEqual(true);
      });
      it('Should throw an error when the api doesn\'t return the correct information', async () => {
        jest.clearAllMocks();
        wrapper.vm.requestIpData.mockReturnValue(null);
        await wrapper.vm.processIp();
        expect(wrapper.vm.error).toEqual(true);
      });
    });
    describe('requestIpData unit tests', () => {
      it('Should get the ip data from the api', async () => {
        jest.clearAllMocks();
        await wrapper.setData({
          userSearch: 'test.com',
        });
        await wrapper.vm.requestIpData();
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('test.com'));
      });
      it('Should throw an error when the api does not return the proper information', async () => {
        jest.clearAllMocks();
        axios.get.mockResolvedValue({
          status: 400,
          data: [],
        });
        await expect(wrapper.vm.requestIpData()).rejects.toThrow('Bad information returned');
        axios.get.mockResolvedValue({
          status: 200,
        });
        await expect(wrapper.vm.requestIpData()).rejects.toThrow('Bad information returned');
      });
    });
  });
});
