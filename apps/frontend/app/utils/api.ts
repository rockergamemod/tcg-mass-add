import {
  type TcgSetDto,
  type TcgCardDto,
  type TcgSeriesDto,
} from '@repo/shared-types';

// TODO: Use a more centralized configuration for all app-related env vars
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const seriesApi = {
  getAll: async (search?: string, type?: string): Promise<TcgSeriesDto[]> => {
    const gameKey = 'pokemon'; // TODO: For now everything is Pokemon
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (type) params.append('type', type);
    const query = params.toString();
    return fetchApi<TcgSeriesDto[]>(
      `/games/${gameKey}/series${query ? `?${query}` : ''}`
    );
  },
};

export const setApi = {
  getAll: async (seriesId: number): Promise<TcgSetDto[]> => {
    const gameKey = 'pokemon'; // TODO: For now everything is Pokemon
    return fetchApi<TcgSetDto[]>(`/games/${gameKey}/series/${seriesId}/sets`);
  },
};

export const cardsApi = {
  getAllForSet: async (
    seriesId: number,
    setId: number
  ): Promise<TcgCardDto[]> => {
    const gameKey = 'pokemon'; // TODO: For now everything is Pokemon
    return fetchApi<TcgCardDto[]>(
      `/games/${gameKey}/series/${seriesId}/sets/${setId}/cards?includes=[sources]`
    );
  },
};
