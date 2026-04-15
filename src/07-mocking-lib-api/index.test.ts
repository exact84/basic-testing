import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));
jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  const getMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (axios.create as jest.Mock).mockReturnValue({
      get: getMock,
    });
  });

  test('should create instance with provided base url', async () => {
    getMock.mockResolvedValue({ data: 'ok' });
    await throttledGetDataFromApi('/sth');
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    getMock.mockResolvedValue({ data: 'ok' });
    await throttledGetDataFromApi('/sth');
    expect(getMock).toHaveBeenCalledWith('/sth');
  });

  test('should return response data', async () => {
    getMock.mockResolvedValue({ data: 'ok' });
    const result = await throttledGetDataFromApi('/sth');
    expect(result).toBe('ok');
  });
});
