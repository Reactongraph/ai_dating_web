import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { characterAttributesApi } from '../services/characterAttributesApi';
import type {
  StyleResponse,
  EthnicityResponse,
  EyeColorResponse,
  HairStyleResponse,
  HairColorResponse,
  BodyTypeResponse,
  BreastSizeResponse,
  ButtSizeResponse,
  ClothingResponse,
  PersonalityResponse,
  OccupationResponse,
  RelationshipResponse,
  OrientationResponse,
  EducationResponse,
  ReligionResponse,
} from '../services/characterAttributesApi';

interface CharacterAttributesState {
  botType: 'girl' | 'boy';
  styles: StyleResponse['relationships'] | null;
  ethnicities: EthnicityResponse['ethinicities'] | null;
  eyeColors: EyeColorResponse['eyeColors'] | null;
  hairStyles: HairStyleResponse['hairStyles'] | null;
  hairColors: HairColorResponse['hairColors'] | null;
  bodyTypes: BodyTypeResponse['bodyTypes'] | null;
  breastSizes: BreastSizeResponse['breastSizes'] | null;
  buttSizes: ButtSizeResponse['buttSizes'] | null;
  clothings: ClothingResponse['clothings'] | null;
  personalities: PersonalityResponse['personalityTypes'] | null;
  occupations: OccupationResponse['occupations'] | null;
  relationships: RelationshipResponse['relationships'] | null;
  orientations: OrientationResponse['orientations'] | null;
  educations: EducationResponse['educations'] | null;
  religions: ReligionResponse['religions'] | null;
  loading: boolean;
  error: string | null;
}

const initialState: CharacterAttributesState = {
  botType: 'girl',
  styles: null,
  ethnicities: null,
  eyeColors: null,
  hairStyles: null,
  hairColors: null,
  bodyTypes: null,
  breastSizes: null,
  buttSizes: null,
  clothings: null,
  personalities: null,
  occupations: null,
  relationships: null,
  orientations: null,
  educations: null,
  religions: null,
  loading: false,
  error: null,
};

const characterAttributesSlice = createSlice({
  name: 'characterAttributes',
  initialState,
  reducers: {
    setBotType: (state, action: PayloadAction<'girl' | 'boy'>) => {
      state.botType = action.payload;
    },
    clearAttributes: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Add matchers for each query
    builder
      // Styles
      .addMatcher(
        characterAttributesApi.endpoints.getStyles.matchFulfilled,
        (state, { payload }) => {
          state.styles = payload.relationships;
        }
      )
      // Ethnicities
      .addMatcher(
        characterAttributesApi.endpoints.getEthnicities.matchFulfilled,
        (state, { payload }) => {
          state.ethnicities = payload.ethinicities;
        }
      )
      // Eye Colors
      .addMatcher(
        characterAttributesApi.endpoints.getEyeColors.matchFulfilled,
        (state, { payload }) => {
          state.eyeColors = payload.eyeColors;
        }
      )
      // Hair Styles
      .addMatcher(
        characterAttributesApi.endpoints.getHairStyles.matchFulfilled,
        (state, { payload }) => {
          state.hairStyles = payload.hairStyles;
        }
      )
      // Hair Colors
      .addMatcher(
        characterAttributesApi.endpoints.getHairColors.matchFulfilled,
        (state, { payload }) => {
          state.hairColors = payload.hairColors;
        }
      )
      // Body Types
      .addMatcher(
        characterAttributesApi.endpoints.getBodyTypes.matchFulfilled,
        (state, { payload }) => {
          state.bodyTypes = payload.bodyTypes;
        }
      )
      // Breast Sizes
      .addMatcher(
        characterAttributesApi.endpoints.getBreastSizes.matchFulfilled,
        (state, { payload }) => {
          state.breastSizes = payload.breastSizes;
        }
      )
      // Butt Sizes
      .addMatcher(
        characterAttributesApi.endpoints.getButtSizes.matchFulfilled,
        (state, { payload }) => {
          state.buttSizes = payload.buttSizes;
        }
      )
      // Clothings
      .addMatcher(
        characterAttributesApi.endpoints.getClothings.matchFulfilled,
        (state, { payload }) => {
          state.clothings = payload.clothings;
        }
      )
      // Personalities
      .addMatcher(
        characterAttributesApi.endpoints.getPersonalities.matchFulfilled,
        (state, { payload }) => {
          state.personalities = payload.personalityTypes;
        }
      )
      // Occupations
      .addMatcher(
        characterAttributesApi.endpoints.getOccupations.matchFulfilled,
        (state, { payload }) => {
          state.occupations = payload.occupations;
        }
      )
      // Relationships
      .addMatcher(
        characterAttributesApi.endpoints.getRelationships.matchFulfilled,
        (state, { payload }) => {
          state.relationships = payload.relationships;
        }
      )
      // Orientations
      .addMatcher(
        characterAttributesApi.endpoints.getOrientations.matchFulfilled,
        (state, { payload }) => {
          state.orientations = payload.orientations;
        }
      )
      // Educations
      .addMatcher(
        characterAttributesApi.endpoints.getEducations.matchFulfilled,
        (state, { payload }) => {
          state.educations = payload.educations;
        }
      )
      // Religions
      .addMatcher(
        characterAttributesApi.endpoints.getReligions.matchFulfilled,
        (state, { payload }) => {
          state.religions = payload.religions;
        }
      );
  },
});

export const { setBotType, clearAttributes } = characterAttributesSlice.actions;
export default characterAttributesSlice.reducer;
