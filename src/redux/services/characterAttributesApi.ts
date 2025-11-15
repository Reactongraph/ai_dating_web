import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base response interface
export interface BaseAttributeResponse {
  _id: string;
  name: string;
  botType?: string;
  image?: { s3Location?: string; path?: string };
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Response interfaces for each attribute type
export interface StyleResponse {
  statusCode: number;
  relationships: Array<BaseAttributeResponse & { candyStyleId: number }>;
}

export interface EthnicityResponse {
  statusCode: number;
  ethinicities: Array<BaseAttributeResponse & { candyEthinicityId: number }>;
}

export interface EyeColorResponse {
  statusCode: number;
  eyeColors: Array<BaseAttributeResponse & { candyEyeColorId: number }>;
}

export interface HairStyleResponse {
  statusCode: number;
  hairStyles: Array<BaseAttributeResponse & { candyHairStyleId: number }>;
}

export interface HairColorResponse {
  statusCode: number;
  hairColors: Array<BaseAttributeResponse & { candyHairColorId: number }>;
}

export interface BodyTypeResponse {
  statusCode: number;
  bodyTypes: Array<BaseAttributeResponse & { candyBodyTypeId: number }>;
}

export interface BreastSizeResponse {
  statusCode: number;
  breastSizes: Array<BaseAttributeResponse & { candyBreastSizeId: number }>;
}

export interface ButtSizeResponse {
  statusCode: number;
  buttSizes: Array<BaseAttributeResponse & { candyButtSizeId: number }>;
}

export interface ClothingResponse {
  statusCode: number;
  clothings: Array<BaseAttributeResponse & { candyClothingId: number }>;
}

export interface PersonalityResponse {
  statusCode: number;
  personalityTypes: Array<{
    _id: string;
    name: string;
    description: string;
    image: {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      destination: string;
      filename: string;
      path: string;
      size: number;
      s3Location: string;
      s3Key: string;
      presignedUrlExpiry: string;
    };
    botType: string;
    createdAt: string;
    updatedAt: string;
    candyPersonalityId: number;
    __v: number;
    imageUrl: string;
  }>;
}

export interface OccupationResponse {
  statusCode: number;
  occupations: Array<BaseAttributeResponse & { candyOccupationId: number }>;
}

export interface RelationshipResponse {
  statusCode: number;
  relationships: Array<BaseAttributeResponse & { candyRelationshipId: number }>;
}

export interface OrientationResponse {
  statusCode: number;
  orientations: Array<{
    _id: string;
    orientationId: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface EducationResponse {
  statusCode: number;
  educations: Array<{
    _id: string;
    educationId: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface ReligionResponse {
  statusCode: number;
  religions: Array<{
    _id: string;
    religionId: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

// Avatar generation interfaces
export interface GenerateAvatarRequest {
  bot_type: 'girl' | 'boy';
  name: string;
  model: 'lustify-sdxl' | 'flux-dev-uncensored' | 'pony-realism' | 'qwen-image' | 'venice-sd35';
  style: 'Anime' | 'Realistic';
  ethnicity: string;
  age: number;
  eye_color: string;
  hair_style: string;
  hair_color: string;
  body_type: string;
  personality: string;
  occupation: string;
  hobbies: string[];
  relationship: string;
  clothing: string;
  breast_size?: string;
  butt_size?: string;
}

export interface GenerateAvatarResponse {
  success: true;
  message: string;
  data: {
    _id: string;
    botProfile: {
      _id: string;
      name: string;
      bot_type: string;
      style: string;
      ethnicity: string;
      age: number;
      eye_color: string;
      hair_style: string;
      hair_color: string;
      body_type: string;
      personality: string;
      occupation: string;
      hobbies: string[];
      relationship: string;
      clothing: string;
      breast_size?: string;
      butt_size?: string;
      bio: string;
      avatar_image: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        destination: string;
        filename: string;
        path: string;
        size: number;
        s3Location: string;
      };
      imageURL: string;
      prompt: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

// Bot Profile Interfaces
export interface BotProfile {
  _id: string;
  name: string;
  age: number;
  description: string;
  imageSrc: string;
  tags: string[];
  botType: 'girl' | 'boy' | 'anime';
  createdAt: string;
  updatedAt: string;
}

export interface GetBotProfilesResponse {
  success: boolean;
  message: string;
  data: BotProfile[];
}

export const characterAttributesApi = createApi({
  reducerPath: 'characterAttributesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth: { token: string | null } }).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    validateStatus: (response, body) => {
      // Treat 304 Not Modified as successful (cached data is still valid)
      return (response.status >= 200 && response.status < 300) || response.status === 304;
    },
  }),
  endpoints: builder => ({
    getStyles: builder.query<StyleResponse, string>({
      query: botType => `/style/get-all-styles-for-app-user/${botType}`,
    }),
    getEthnicities: builder.query<EthnicityResponse, string>({
      query: botType => `/ethinicity/get-all-ethinicities-for-app-user/${botType}`,
    }),
    getEyeColors: builder.query<EyeColorResponse, string>({
      query: botType => `/eyeColor/get-all-eyeColors-for-app-user/${botType}`,
    }),
    getHairStyles: builder.query<HairStyleResponse, string>({
      query: botType => `/hairStyle/get-all-hairStyles-for-app-user/${botType}`,
    }),
    getHairColors: builder.query<HairColorResponse, string>({
      query: botType => `/hairColor/get-all-hairColors-for-app-user/${botType}`,
    }),
    getBodyTypes: builder.query<BodyTypeResponse, string>({
      query: botType => `/bodyType/get-all-bodyTypes-for-app-user/${botType}`,
    }),
    getBreastSizes: builder.query<BreastSizeResponse, void>({
      query: () => '/breastSize/get-all-breastSizes-for-app-user',
    }),
    getButtSizes: builder.query<ButtSizeResponse, void>({
      query: () => '/buttSize/get-all-buttSizes-for-app-user',
    }),
    getClothings: builder.query<ClothingResponse, string>({
      query: botType => `/clothing/get-all-clothings-for-app-user/${botType}`,
    }),
    getPersonalities: builder.query<PersonalityResponse, string>({
      query: botType => `/personality/get-all-perosnalities-for-app-user/${botType}`,
    }),
    getOccupations: builder.query<OccupationResponse, string>({
      query: botType => `/occupation/get-all-occupations-for-app-user/${botType}`,
    }),
    getRelationships: builder.query<RelationshipResponse, string>({
      query: botType => `/relationship/get-all-relationships-for-app-user/${botType}`,
    }),
    getOrientations: builder.query<OrientationResponse, void>({
      query: () => '/orientation/get-all',
    }),
    getEducations: builder.query<EducationResponse, void>({
      query: () => '/education/get-all-education',
    }),
    getReligions: builder.query<ReligionResponse, void>({
      query: () => '/religion/get-all-religion',
    }),
    generateAvatar: builder.mutation<
      GenerateAvatarResponse,
      { userId: string; data: GenerateAvatarRequest }
    >({
      query: ({ userId, data }) => ({
        url: `/users/generate-avatar-image/${userId}`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
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
  useGenerateAvatarMutation,
} = characterAttributesApi;
