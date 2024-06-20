import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

const api = axios.create();


export const mockedApi = new AxiosMockAdapter(api, { delayResponse: 200 });
export default api;

mockedApi.onGet('/users').reply(200, [
    {
      id: 1,
      username: 'JohnDoe',
      email: 'VUjZB@example.com',
    },
    {
      id: 2,
      username: 'JaneAir',
      email: 'aXpDg@example.com',
    },
    {
      id: 3,
      username: 'JohnSmith',
      email: 'VUjZBe@example.com',
    },
]);
  

mockedApi.onGet('/projects').reply(200, [
    {
        id: 1,
        name: `Project 1`,
    },
    {
        id: 2,
        name: `Project 2`,
    },
    {
        id: 3,
        name: `Project 3`,
    },

    {
        id: 4,
        name: `Project 4`,
    },

    {
        id: 5,
        name: `Project 5`,
    },

    {
        id: 6,
        name: `Project 6`,
    },

  ]);