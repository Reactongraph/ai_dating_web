'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import LayoutWithoutFooter from '@/components/layouts/LayoutWithoutFooter';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadProfilePictureMutation,
} from '@/redux/services/profileApi';
import { clearCredentials } from '@/redux/slices/authSlice';
import { useSnackbar } from '@/providers';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import ReferralModal from '@/components/modals/ReferralModal';

interface ProfileFormData {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  gender: 'man' | 'woman' | 'other';
  dateOfBirth: string;
  aboutMe: string;
}

export default function ProfilePage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const { showSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  // Helper function to handle logout when user is missing
  const handleLogout = () => {
    // Clear Redux credentials
    dispatch(clearCredentials());

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userData');

      // Sign out from NextAuth and redirect
      signOut({
        redirect: true,
        callbackUrl: '/',
      }).catch(err => {
        console.error('Error signing out:', err);
        // Fallback: redirect manually if signOut fails
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      });
    }
  };

  // Get userId from auth state
  const userId = user?._id || '';

  const {
    data: profileResponse,
    isLoading: isLoadingProfile,
    refetch: refetchProfile,
  } = useGetProfileQuery(userId, {
    skip: !userId, // Skip query if userId is not available
  });

  // Extract user data from response
  const profileData = profileResponse?.user;

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadProfilePicture, { isLoading: isUploading }] = useUploadProfilePictureMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: {
      /* errors */
    },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      email: '',
      countryCode: '+91',
      phone: '',
      gender: 'other',
      dateOfBirth: '',
      aboutMe: '',
    },
  });

  // Initialize form with user data
  useEffect(() => {
    if (profileData || user) {
      const userData = profileData || user;
      if (userData) {
        setValue('name', userData.name || '');
        setValue('email', userData.email || '');
        // Handle countryCode - backend stores as number, convert to string with + prefix for dropdown
        const countryCodeValue = (userData as { countryCode?: number }).countryCode;
        // Format country code: backend sends number (e.g., 1), convert to string with + prefix (e.g., "+1")
        const formattedCountryCode =
          countryCodeValue !== undefined && countryCodeValue !== null
            ? `+${countryCodeValue}`
            : '+1'; // Default to +1 (US)
        setValue('countryCode', formattedCountryCode);
        // Handle phone - convert number to string for input field
        const phoneValue =
          (userData as { phone?: number | string }).phone !== undefined
            ? String((userData as { phone?: number | string }).phone || '')
            : '';
        setValue('phone', phoneValue);
        // Backend uses 'man' | 'woman' | 'other' directly, so no mapping needed
        const genderValue = ((userData.gender as 'man' | 'woman' | 'other') || 'other') as
          | 'man'
          | 'woman'
          | 'other';
        setValue('gender', genderValue);
        // Handle dateOfBirth - API uses birthDate, convert ISO date to YYYY-MM-DD format
        const birthDateValue =
          ((userData as { birthDate?: string | Date }).birthDate as string | Date) ||
          ((userData as { dateOfBirth?: string | Date }).dateOfBirth as string | Date) ||
          '';

        // Convert ISO date string (e.g., "1988-01-01T00:00:00.000Z") to YYYY-MM-DD format
        let formattedDate = '';
        if (birthDateValue) {
          try {
            const date = new Date(birthDateValue);
            if (!isNaN(date.getTime())) {
              // Format as YYYY-MM-DD for date input
              formattedDate = date.toISOString().split('T')[0];
            }
          } catch (error) {
            console.error('Error parsing birthDate:', error);
          }
        }
        setValue('dateOfBirth', formattedDate);
        setValue('aboutMe', userData.aboutMe || '');
      }
    }
  }, [profileData, user, setValue]);

  // Handle file selection for profile picture
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          setPreviewUrl(fileReader.result);
        }
      };
      fileReader.readAsDataURL(file);

      // Immediately upload the image when file is selected
      if (!userId) {
        showSnackbar('Your session has expired. Redirecting to login...', 'error');
        handleLogout();
        return;
      }

      setIsUploadingImage(true);
      try {
        const imageResponse = await uploadProfilePicture({
          userId,
          file: file,
        }).unwrap();

        if (imageResponse.statusCode === 200) {
          showSnackbar(imageResponse.message || 'Profile image updated successfully!', 'success');
          // Update preview with the new profile image URL if available
          if (imageResponse.profileImage?.s3Location) {
            setPreviewUrl(imageResponse.profileImage.s3Location);
          } else if (imageResponse.profileImage?.url) {
            setPreviewUrl(imageResponse.profileImage.url);
          } else if (imageResponse.user?.profileImageUrl) {
            setPreviewUrl(imageResponse.user.profileImageUrl);
          } else if (
            (imageResponse.user as { profileImage?: { s3Location?: string } })?.profileImage
              ?.s3Location
          ) {
            setPreviewUrl(
              (
                imageResponse.user as {
                  profileImage?: { s3Location?: string };
                }
              ).profileImage?.s3Location as string,
            );
          }
          // Refetch profile data to get updated user information
          refetchProfile();
        }
      } catch (error) {
        console.error('Failed to upload profile image:', error);
        const errorMessage =
          typeof error === 'object' &&
          error !== null &&
          'data' in error &&
          typeof error.data === 'object' &&
          error.data !== null &&
          'message' in error.data
            ? (error.data.message as string)
            : 'Failed to upload profile image. Please try again.';
        showSnackbar(errorMessage, 'error');
        // Reset preview on error
        setPreviewUrl(null);
        // Reset file input
        if (e.target) {
          e.target.value = '';
        }
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  // Handle profile update
  const onSubmit = async (data: ProfileFormData) => {
    if (!userId) {
      showSnackbar('Your session has expired. Redirecting to login...', 'error');
      handleLogout();
      return;
    }

    try {
      // Update profile data (image is already uploaded when file is selected)
      // Backend uses 'man' | 'woman' | 'other' directly, so no mapping needed
      const response = await updateProfile({
        userId,
        data: {
          name: data.name,
          phone: data.phone ? Number(data.phone) : undefined,
          countryCode: data.countryCode
            ? Number(data.countryCode) // Convert "+1" to 1 for API
            : undefined,
          gender: data.gender as 'man' | 'woman' | 'other',
          birthDate: data.dateOfBirth,
          aboutMe: data.aboutMe,
        },
      }).unwrap();

      if (response.statusCode === 200) {
        showSnackbar(response.message || 'Profile updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      const errorMessage =
        typeof error === 'object' &&
        error !== null &&
        'data' in error &&
        typeof error.data === 'object' &&
        error.data !== null &&
        'message' in error.data
          ? (error.data.message as string)
          : 'Failed to update profile. Please try again.';
      showSnackbar(errorMessage, 'error');
    }
  };

  return (
    <LayoutWithoutFooter>
      <div className="container mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
        <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center">
          My Account
        </h1>

        <div className="flex flex-col md:flex-row max-w-3xl mx-auto space-y-6 md:space-y-0">
          {/* Left Side - Profile Picture */}
          <div className="md:w-1/3 flex flex-col items-center mb-4 sm:mb-6 md:mb-0">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 mb-3 sm:mb-4 bg-gray-500 rounded-full overflow-hidden">
              {(() => {
                // Get profile image URL with priority order
                const profileImageUrl =
                  previewUrl ||
                  (profileData &&
                    (profileData as { profileImage?: { s3Location?: string } })?.profileImage
                      ?.s3Location) ||
                  (profileData &&
                    (profileData as { profileImage?: { url?: string } })?.profileImage?.url) ||
                  (profileData && (profileData as { profileImageUrl?: string })?.profileImageUrl) ||
                  (profileData?.photoUrl &&
                  Array.isArray(profileData.photoUrl) &&
                  profileData.photoUrl.length > 0
                    ? (profileData.photoUrl[0] as string)
                    : '') ||
                  (user &&
                    (user as { profileImage?: { s3Location?: string } })?.profileImage
                      ?.s3Location) ||
                  (user && (user as { profileImageUrl?: string })?.profileImageUrl) ||
                  (user?.profilePicture as string) ||
                  '';

                return profileImageUrl ? (
                  <Image
                    src={profileImageUrl || '/assets/default-avatar.png'}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image
                      src="/assets/profile.svg"
                      alt="Default Avatar"
                      width={100}
                      height={100}
                    />
                  </div>
                );
              })()}
            </div>

            <button
              onClick={() => document.getElementById('profile-upload')?.click()}
              disabled={isUploadingImage || isUploading}
              className="mt-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black border border-gray-600 rounded-md text-white text-sm sm:text-base hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploadingImage ? 'Uploading...' : 'Upload Photo'}
            </button>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Right Side - Form Fields */}
          <div className="md:w-2/3 md:pl-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name */}
              <div className="mb-3 sm:mb-4">
                <label htmlFor="name" className="block text-xs text-gray-400 mb-1">
                  Full Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  className="w-full bg-gray-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-md focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="mb-3 sm:mb-4">
                <label htmlFor="email" className="block text-xs text-gray-400 mb-1">
                  Email Id
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  disabled
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none opacity-70 cursor-not-allowed"
                />
              </div>

              {/* Phone Number with Country Code */}
              <div className="mb-3 sm:mb-4">
                <label htmlFor="phone" className="block text-xs text-gray-400 mb-1">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  {/* Country Code Dropdown */}
                  <div className="relative w-24 sm:w-28">
                    <select
                      {...register('countryCode')}
                      id="countryCode"
                      className="w-full bg-gray-900 text-white px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none pr-8"
                    >
                      <option value="1">+1 (US)</option>
                      <option value="44">+44 (UK)</option>
                      <option value="91">+91 (IN)</option>
                      <option value="86">+86 (CN)</option>
                      <option value="81">+81 (JP)</option>
                      <option value="49">+49 (DE)</option>
                      <option value="33">+33 (FR)</option>
                      <option value="39">+39 (IT)</option>
                      <option value="34">+34 (ES)</option>
                      <option value="61">+61 (AU)</option>
                      <option value="55">+55 (BR)</option>
                      <option value="52">+52 (MX)</option>
                      <option value="7">+7 (RU)</option>
                      <option value="82">+82 (KR)</option>
                      <option value="65">+65 (SG)</option>
                      <option value="971">+971 (AE)</option>
                      <option value="966">+966 (SA)</option>
                      <option value="27">+27 (ZA)</option>
                      <option value="234">+234 (NG)</option>
                      <option value="20">+20 (EG)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {/* Phone Number Input */}
                  <div className="flex-1">
                    <input
                      {...register('phone')}
                      type="tel"
                      id="phone"
                      placeholder="Enter your phone number"
                      className="w-full bg-gray-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Gender Selection */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs text-gray-400 mb-1">Select Gender</label>
                <div className="grid grid-cols-3 gap-1 sm:gap-2">
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <>
                        <button
                          type="button"
                          onClick={() => field.onChange('man')}
                          className={`py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm rounded-md ${
                            field.value === 'man'
                              ? 'bg-gray-700 text-white'
                              : 'bg-gray-900 text-white'
                          }`}
                        >
                          Man
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange('woman')}
                          className={`py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm rounded-md ${
                            field.value === 'woman'
                              ? 'bg-cyan-500 text-white'
                              : 'bg-gray-900 text-white'
                          }`}
                        >
                          Woman
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange('other')}
                          className={`py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm rounded-md ${
                            field.value === 'other'
                              ? 'bg-gray-700 text-white'
                              : 'bg-gray-900 text-white'
                          }`}
                        >
                          Other
                        </button>
                      </>
                    )}
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="mb-3 sm:mb-4">
                <label htmlFor="dateOfBirth" className="block text-xs text-gray-400 mb-1">
                  Date of Birth
                </label>
                <input
                  {...register('dateOfBirth')}
                  type="date"
                  id="dateOfBirth"
                  max={
                    new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                      .toISOString()
                      .split('T')[0]
                  }
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <p className="mt-1 text-xs text-gray-500">Your age cannot be changed later</p>
              </div>

              {/* About Me */}
              <div className="mb-6">
                <label htmlFor="aboutMe" className="block text-xs text-gray-400 mb-1">
                  About Me
                </label>
                <textarea
                  {...register('aboutMe')}
                  id="aboutMe"
                  rows={4}
                  maxLength={300}
                  className="w-full bg-gray-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-md focus:outline-none"
                  placeholder="Tell us about yourself..."
                ></textarea>
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-500">
                    {(watch('aboutMe') as string)?.length || 0}/300 Characters
                  </span>
                </div>
              </div>

              {/* Subscription Plan */}
              <div className="mb-4 sm:mb-6 bg-gray-900 p-3 sm:p-4 rounded-md border border-gray-800">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-medium mb-1">Current Plan</h3>
                    <p className="text-cyan-400 font-semibold">
                      {profileData?.subscriber?.isPremiumSubscriber ? 'Premium' : 'Free'}
                    </p>

                    {profileData?.subscriber?.isPremiumSubscriber &&
                      profileData?.subscriptionDetails?.isActive && (
                        <div className="mt-3 space-y-2">
                          {/* Plan Name and Details */}
                          {(() => {
                            const planData = profileData.subscriptionDetails.planId as {
                              planName?: string;
                              planSchedule?: Array<{
                                planValidity?: number;
                                planPrice?: number;
                                credits?: number;
                                perMonthPlanPrice?: number;
                              }>;
                            };

                            return (
                              <>
                                {planData?.planName && (
                                  <div className="bg-gray-800 p-2 rounded-md">
                                    <p className="text-xs text-gray-400">Plan Type</p>
                                    <p className="text-sm text-white font-medium">
                                      {planData.planName}
                                    </p>
                                    {planData.planSchedule &&
                                      planData.planSchedule[0]?.planValidity && (
                                        <p className="text-xs text-gray-400 mt-0.5">
                                          {planData.planSchedule[0].planValidity === 1
                                            ? 'Monthly'
                                            : planData.planSchedule[0].planValidity === 6
                                              ? 'Half-Yearly (6 months)'
                                              : planData.planSchedule[0].planValidity === 12
                                                ? 'Annual (12 months)'
                                                : `${planData.planSchedule[0].planValidity} months`}
                                        </p>
                                      )}
                                  </div>
                                )}

                                {/* Credits Info */}
                                {planData?.planSchedule?.[0]?.credits && (
                                  <div className="flex items-center gap-2 text-xs">
                                    <svg
                                      className="w-3.5 h-3.5 text-yellow-400"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    <span className="text-gray-300">
                                      {planData.planSchedule[0].credits} Credits included
                                    </span>
                                  </div>
                                )}
                              </>
                            );
                          })()}

                          {/* Subscription Dates */}
                          <div className="space-y-1.5 text-xs text-gray-400 pt-2 border-t border-gray-800">
                            {profileData.subscriptionDetails.startDate && (
                              <p className="flex items-center gap-1.5">
                                <svg
                                  className="w-3 h-3 text-green-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span>
                                  Active since:{' '}
                                  {new Date(
                                    profileData.subscriptionDetails.startDate,
                                  ).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </p>
                            )}

                            {profileData.subscriptionDetails.expiryDate && (
                              <>
                                <p className="flex items-center gap-1.5">
                                  <svg
                                    className="w-3 h-3 text-orange-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  <span>
                                    Expires:{' '}
                                    {new Date(
                                      profileData.subscriptionDetails.expiryDate,
                                    ).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </span>
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <svg
                                    className="w-3 h-3 text-cyan-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span>
                                    {(() => {
                                      const now = new Date();
                                      const expiry = new Date(
                                        profileData.subscriptionDetails.expiryDate,
                                      );
                                      const daysLeft = Math.ceil(
                                        (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
                                      );
                                      return daysLeft > 0
                                        ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining`
                                        : 'Expired';
                                    })()}
                                  </span>
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  {!profileData?.subscriber?.isPremiumSubscriber && (
                    <button
                      type="button"
                      onClick={() => (window.location.href = '/subscriptions')}
                      className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-black px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-md hover:opacity-90 transition-opacity flex-shrink-0"
                    >
                      Upgrade to Premium
                    </button>
                  )}
                </div>
              </div>

              {/* Referral Program */}
              <div className="mb-4 sm:mb-6 bg-gray-900 p-3 sm:p-4 rounded-md border border-gray-800">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-medium mb-1">Referral Program</h3>
                    <p className="text-xs text-gray-400">
                      Invite friends and earn 0.4 credits for each successful Telegram signup.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsReferralModalOpen(true)}
                    className="ml-4 bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md transition-colors flex-shrink-0"
                  >
                    Invite Friends
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div className="mb-4 sm:mb-6 bg-gray-900 p-3 sm:p-4 rounded-md border border-gray-800">
                <label className="block text-xs text-gray-400 mb-2">Language</label>
                <div className="relative">
                  <select
                    className="w-full bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none appearance-none"
                    defaultValue="en"
                  >
                    <option value="en">English</option>
                    {/* <option value="es">Spanish</option>
                    <option value="fr">French</option> */}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Language Section (second one for Notifications) */}
              <div className="mb-4 sm:mb-6 bg-gray-900 p-3 sm:p-4 rounded-md border border-gray-800">
                <label className="block text-xs text-gray-400 mb-2">Language</label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-cyan-500 rounded-sm"
                    defaultChecked
                  />
                  <span className="text-sm text-gray-400">
                    You&apos;ll automatically receive notifications from us. If you prefer not to,
                    simply uncheck the box to opt out.
                  </span>
                </label>
              </div>

              {/* Delete Account */}
              {/* <div className="mb-4 sm:mb-6 bg-gray-900 p-3 sm:p-4 rounded-md border border-gray-800">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    If you no longer wish to use this account, you can delete it along with all
                    saved data. Please proceed with caution.
                  </p>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-400 transition-colors text-xs sm:text-sm"
                  >
                    Delete Account
                  </button>
                </div>
              </div> */}

              {/* Update Button */}
              <div className="flex justify-center mb-6">
                <button
                  type="submit"
                  disabled={isUpdating || isUploading || isLoadingProfile}
                  className="bg-black text-white px-6 sm:px-8 py-1.5 sm:py-2 text-sm sm:text-base rounded-md border border-gray-800 hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating || isUploading
                    ? 'Updating...'
                    : isLoadingProfile
                      ? 'Loading...'
                      : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ReferralModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
        referralCode={profileData?.referralCode || (user as any)?.referralCode || ''}
      />
    </LayoutWithoutFooter>
  );
}
