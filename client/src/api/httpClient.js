import axios from "axios";

export class ApiError extends Error {
  constructor(
    message,
    { status = null, code = "unknown", aborted = false } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.aborted = aborted;
  }
}

const transport = axios.create({ baseURL: "/" });

// Return application data and stable errors, never Axios response/config objects.
// Callers can pass an AbortSignal without depending on Axios cancellation APIs.
export const createHttpClient = (client) => {
  const request = async (method, url, data, { signal } = {}) => {
    try {
      const response = await client.request({ method, url, data, signal });
      return response.data;
    } catch (error) {
      throw new ApiError("The request could not be completed.", {
        status: error.response?.status ?? null,
        code: error.code || "network_error",
        aborted: error.code === "ERR_CANCELED" || error.name === "AbortError",
      });
    }
  };
  return {
    get: (url, options) => request("GET", url, undefined, options),
    post: (url, data, options) => request("POST", url, data, options),
  };
};

export const httpClient = createHttpClient(transport);
