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
    let cleanToken = rawToken;
    try {
      cleanToken = JSON.parse(rawToken);
    } catch {
      cleanToken = rawToken;
    }
    if (cleanToken) {
      cleanToken = String(cleanToken).replace(/^["']|["']$/g, "").trim();
      authHeader = {
        Authorization: `Bearer ${cleanToken}`,
      };
    }
  }

  return axios({
    method,
    url,
    data: bodyData,
    params,
    headers: {
      ...authHeader,
      ...headers,
    },
    withCredentials: true,
  });
};
