import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import authConfig from "../auth_config.json";
import { Synopsis } from "../types/Synopsis";

const baseUrl = `${authConfig.apiBase}/synopsis`;

export const useSynopsis = () => {
  const { getAccessTokenSilently, isLoading, error } = useAuth0();
  const [synopsis, setSynopsis] = useState<Synopsis[] | undefined>(undefined);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const getSynopsis = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(baseUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { data } = await response.json();
        setSynopsis(data?.columns as Synopsis[]);
      } catch (error) {
        console.log(error);
        if (retryCount < authConfig.maxRetries) {
          // Retry the request by incrementing the retry count
          setRetryCount(retryCount + 1);
        } else {
          // Maximum number of retries reached, handle the error
          console.log("Maximum retries reached. Unable to fetch synopsis.");
        }
      }
    };

    getSynopsis();
  }, [getAccessTokenSilently, retryCount]);

  return { synopsis, isLoading, error };
};
