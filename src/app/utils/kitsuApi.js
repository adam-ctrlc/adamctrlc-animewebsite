const KITSU_API_BASE_URL = 'https://kitsu.io/api/edge';

/**
 * Fetches data from the Kitsu API.
 * @param {string} endpoint - The API endpoint (e.g., '/trending/anime', '/anime').
 * @param {object} params - Query parameters for the request (e.g., { limit: 10, sort: '-user_count' }).
 * @returns {Promise<Array|null>} - A promise that resolves to the array of data items or null if an error occurs.
 */
export const fetchKitsuData = async (endpoint, params = {}) => {
  const url = new URL(`${KITSU_API_BASE_URL}${endpoint}`);

  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      // Handle nested filter parameters like { filter: { status: 'upcoming' } }
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        url.searchParams.append(`filter[${nestedKey}]`, nestedValue);
      });
    } else {
      url.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    });

    if (!response.ok) {
      // Log more detailed error information
      const errorData = await response.json().catch(() => ({})); // Try to parse error response
      console.error(
        `Kitsu API Error: ${response.status} ${response.statusText}`,
        errorData
      );
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${
          errorData?.errors?.[0]?.detail || response.statusText
        }`
      );
    }

    const data = await response.json();
    return data.data; // Kitsu API wraps results in a 'data' array
  } catch (error) {
    console.error('Error fetching from Kitsu API:', error);
    // Re-throw the error to be caught by the calling function (e.g., in AnimeContext)
    // This allows the UI to display a more specific error message if needed.
    throw error;
  }
};
