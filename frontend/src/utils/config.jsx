export const api = "http://localhost:5000/api";
export const uploads = "http://localhost:5000/uploads";

export const requestConfig = (method, data, token = null, image = false) => {
  let headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let config = {
    method,
    headers,
  };

  if (image) {
    config.body = data;
  } else if (data) {
    config.headers["Content-Type"] = "application/json";
    config.body = JSON.stringify(data);
  }

  return config;
};
