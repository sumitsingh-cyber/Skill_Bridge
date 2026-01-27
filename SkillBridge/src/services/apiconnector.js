import axios from "axios";

export const apiConnector = (
  method,
  url,
  bodyData = null,
  headers = {},
  params = {}
) => {
  const rawToken = localStorage.getItem("token");

  let authHeader = {};
  if (rawToken && rawToken !== "null" && rawToken !== "undefined") {
    authHeader = {
      Authorization: `Bearer ${JSON.parse(rawToken)}`,
    };
  }

  return axios({
    method,
    url,
    data: bodyData,
    params,
    headers: {
      ...headers,
      ...authHeader,
    },
  });
};
