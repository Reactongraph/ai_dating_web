import { useAppSelector } from '@/redux/hooks';
import {
  useGetStylesQuery,
  useGetEthnicitiesQuery,
  useGetEyeColorsQuery,
  useGetHairStylesQuery,
  useGetHairColorsQuery,
  useGetBodyTypesQuery,
  useGetBreastSizesQuery,
  useGetButtSizesQuery,
  useGetClothingsQuery,
  useGetPersonalitiesQuery,
  useGetOccupationsQuery,
  useGetRelationshipsQuery,
  useGetOrientationsQuery,
  useGetEducationsQuery,
  useGetReligionsQuery,
} from '@/redux/services/characterAttributesApi';

export const useCharacterAttributes = () => {
  const botType = useAppSelector((state) => state.characterAttributes.botType);

  // Queries that depend on botType
  const { data: styles, isLoading: isLoadingStyles } =
    useGetStylesQuery(botType);
  const { data: ethnicities, isLoading: isLoadingEthnicities } =
    useGetEthnicitiesQuery(botType);
  const { data: eyeColors, isLoading: isLoadingEyeColors } =
    useGetEyeColorsQuery(botType);
  const { data: hairStyles, isLoading: isLoadingHairStyles } =
    useGetHairStylesQuery(botType);
  const { data: hairColors, isLoading: isLoadingHairColors } =
    useGetHairColorsQuery(botType);
  const { data: bodyTypes, isLoading: isLoadingBodyTypes } =
    useGetBodyTypesQuery(botType);
  const { data: clothings, isLoading: isLoadingClothings } =
    useGetClothingsQuery(botType);
  const { data: personalities, isLoading: isLoadingPersonalities } =
    useGetPersonalitiesQuery(botType);
  const { data: occupations, isLoading: isLoadingOccupations } =
    useGetOccupationsQuery(botType);
  const { data: relationships, isLoading: isLoadingRelationships } =
    useGetRelationshipsQuery(botType);

  // Queries that don't depend on botType
  const { data: breastSizes, isLoading: isLoadingBreastSizes } =
    useGetBreastSizesQuery();
  const { data: buttSizes, isLoading: isLoadingButtSizes } =
    useGetButtSizesQuery();
  const { data: orientations, isLoading: isLoadingOrientations } =
    useGetOrientationsQuery();
  const { data: educations, isLoading: isLoadingEducations } =
    useGetEducationsQuery();
  const { data: religions, isLoading: isLoadingReligions } =
    useGetReligionsQuery();

  const isLoading =
    isLoadingStyles ||
    isLoadingEthnicities ||
    isLoadingEyeColors ||
    isLoadingHairStyles ||
    isLoadingHairColors ||
    isLoadingBodyTypes ||
    isLoadingBreastSizes ||
    isLoadingButtSizes ||
    isLoadingClothings ||
    isLoadingPersonalities ||
    isLoadingOccupations ||
    isLoadingRelationships ||
    isLoadingOrientations ||
    isLoadingEducations ||
    isLoadingReligions;

  return {
    botType,
    styles: styles?.relationships || [],
    ethnicities: ethnicities?.ethinicities || [],
    eyeColors: eyeColors?.eyeColors || [],
    hairStyles: hairStyles?.hairStyles || [],
    hairColors: hairColors?.hairColors || [],
    bodyTypes: bodyTypes?.bodyTypes || [],
    breastSizes: breastSizes?.breastSizes || [],
    buttSizes: buttSizes?.buttSizes || [],
    clothings: clothings?.clothings || [],
    personalities: personalities?.personalityTypes || [],
    occupations: occupations?.occupations || [],
    relationships: relationships?.relationships || [],
    orientations: orientations?.orientations || [],
    educations: educations?.educations || [],
    religions: religions?.religions || [],
    isLoading,
  };
};
