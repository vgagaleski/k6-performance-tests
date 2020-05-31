import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

let errorRate = new Rate('Error rate');

export let options = {
  duration: '5s',
  vus: 2,
};

export function setup() {
  console.log(`Running test on: https://jsonplaceholder.typicode.com/posts `);

  const requestVariables = {
    baseUrl: `https://jsonplaceholder.typicode.com/posts`,
  };

  return requestVariables;
}

export default function (requestVariables) {
  const url = requestVariables.baseUrl;
  const body = {};
  const params = {};

  const response = http.get(url, body, params);

  const result = check(response, {
    'GET response was 200': (response) => {
      if (response.status != 200) {
        console.error(
          `Transaction for Home-Page failed with HTTP status code: ${response.status}!`,
        );
      }
      return response.status == 200;
    },
  });

  errorRate.add(!result);

  sleep(3);
}
