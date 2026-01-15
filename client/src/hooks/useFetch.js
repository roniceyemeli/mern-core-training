// client/src/hooks/useFetch.js - Custom hook for API calls
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        url,
        ...options,
      });
      setData(response.data);
    } catch (err) {
      setError({
        message: err.response?.data?.error || err.message,
        status: err.response?.status,
      });
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [fetchData, url]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};
