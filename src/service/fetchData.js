import fetch from 'isomorphic-fetch';

class RestaurantData {
  async fetchRestaurantData() {
    const response = await fetch(`${process.env.REACT_APP_API_URL}`, {
    headers: {
      Authorization: `Api-Key ${process.env.REACT_APP_AUTHORIZATION_TOKEN}`,
    },
  }).then(response => response.json());

    return response;
  }
}

export default new RestaurantData();
