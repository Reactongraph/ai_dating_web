import { useMemo, useEffect, useRef } from 'react';
import {
  useGetBotProfilesQuery,
  useGetLikedBotsQuery,
  botProfilesApi,
} from '@/redux/services/botProfilesApi';
import { mapBotProfilesToCompanions } from '@/utils/mappers';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { selectContentMode } from '@/redux/slices/contentModeSlice';
import { Companion } from '@/components/cards/CompanionCard';

/**
 * Custom hook to fetch bot profiles with liked status
 * Handles authentication state changes and automatically refetches when user logs in
 * Filters bot profiles by content mode (nsfw/sfw) from navbar
 *
 * @param botType - The type of bot to fetch ('girl' | 'boy' | 'anime')
 * @returns Object containing companions, loading state, error, and liked bot IDs
 */
export const useBotProfilesWithLikes = (botType: 'girl' | 'boy' | 'anime') => {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const contentMode = useAppSelector(selectContentMode); // Get contentMode from navbar
  const dispatch = useAppDispatch();
  const prevAuthenticatedRef = useRef(isAuthenticated);

  // Fetch bot profiles for the specified bot type with category filter
  // Only send category when contentMode is 'nsfw', otherwise don't send it to get both sfw and nsfw profiles
  const {
    data: botProfilesResponse,
    isLoading,
    error,
    refetch: refetchBotProfiles,
  } = useGetBotProfilesQuery({
    botType,
    category: contentMode === 'nsfw' ? 'nsfw' : undefined, // Only send category when nsfw mode
    // page and limit can be added here if needed for pagination
  });

  // Fetch liked bots if user is authenticated
  const { data: likedBotsResponse } = useGetLikedBotsQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Refetch bot profiles when authentication state changes from false to true
  useEffect(() => {
    if (!prevAuthenticatedRef.current && isAuthenticated) {
      // User just logged in, invalidate cache and refetch bot profiles to get updated isLiked values
      const categoryTag = contentMode === 'nsfw' ? 'nsfw' : 'all';
      dispatch(
        botProfilesApi.util.invalidateTags([
          { type: 'BotProfiles', id: `${botType}-${categoryTag}` },
        ]),
      );
      refetchBotProfiles();
    }
    prevAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated, refetchBotProfiles, dispatch, botType, contentMode]);

  // Get liked bot IDs
  const likedBotIds = useMemo(() => {
    return likedBotsResponse?.likedBots || [];
  }, [likedBotsResponse]);

  // Transform API data to companion format with liked status
  const companions: Companion[] = useMemo(() => {
    if (!botProfilesResponse?.botProfiles) {
      return [];
    }
    return mapBotProfilesToCompanions(botProfilesResponse.botProfiles, likedBotIds);
  }, [botProfilesResponse?.botProfiles, likedBotIds]);
  // console.log('companions', { companions, botProfilesResponse });
  return {
    companions,
    isLoading,
    error,
    likedBotIds,
    botProfiles: botProfilesResponse?.botProfiles || [],
    pagination: botProfilesResponse?.pagination, // Include pagination info
    refetch: refetchBotProfiles,
  };
};
