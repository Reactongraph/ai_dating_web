'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import LayoutWithoutFooter from '@/components/layouts/LayoutWithoutFooter';
import { useAppSelector } from '@/redux/hooks';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadProfilePictureMutation,
} from '@/redux/services/profileApi';
import { useSnackbar } from '@/providers';
import Image from 'next/image';

interface ProfileFormData {
  name: string;
  email: string;
  gender: 'man' | 'woman' | 'other';
  dateOfBirth: string;
  aboutMe: string;
}

export default function ProfilePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { showSnackbar } = useSnackbar();
  const { user } = useAppSelector((state) => state.auth);

  const { data: profileData } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadProfilePicture, { isLoading: isUploading }] =
    useUploadProfilePictureMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: {
      /* errors */
    },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      email: '',
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
        setValue('gender', userData.gender as 'man' | 'woman' | 'other');
        setValue('dateOfBirth', (userData.dateOfBirth as string) || '');
        setValue('aboutMe', userData.aboutMe || '');
      }
    }
  }, [profileData, user, setValue]);

  // Handle file selection for profile picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          setPreviewUrl(fileReader.result);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Handle profile update
  const onSubmit = async (data: ProfileFormData) => {
    try {
      // First upload profile picture if selected
      if (selectedFile) {
        await uploadProfilePicture(selectedFile).unwrap();
      }

      // Then update profile data
      const response = await updateProfile({
        name: data.name,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        aboutMe: data.aboutMe,
      }).unwrap();

      if (response.success || response.statusCode === 200) {
        showSnackbar('Profile updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      showSnackbar('Failed to update profile. Please try again.', 'error');
    }
  };

  return (
    <LayoutWithoutFooter>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">My Account</h1>

        <div className="flex flex-col md:flex-row max-w-3xl mx-auto">
          {/* Left Side - Profile Picture */}
          <div className="md:w-1/3 flex flex-col items-center mb-8">
            <div className="relative w-40 h-40 mb-4 bg-gray-500 rounded-full overflow-hidden">
              {previewUrl || (user && user.profilePicture) ? (
                <Image
                  src={
                    previewUrl ||
                    (user?.profilePicture as string) ||
                    '/assets/default-avatar.png'
                  }
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
              )}
            </div>

            <button
              onClick={() => document.getElementById('profile-upload')?.click()}
              className="mt-2 px-4 py-2 bg-black border border-gray-600 rounded-md text-white hover:bg-gray-900 transition-colors"
            >
              Upload Photo
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
          <div className="md:w-2/3">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-xs text-gray-400 mb-1"
                >
                  Full Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-xs text-gray-400 mb-1"
                >
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

              {/* Gender Selection */}
              <div className="mb-4">
                <label className="block text-xs text-gray-400 mb-1">
                  Select Gender
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <>
                        <button
                          type="button"
                          onClick={() => field.onChange('Man')}
                          className={`py-2 px-4 rounded-md ${
                            field.value === 'Man'
                              ? 'bg-gray-700 text-white'
                              : 'bg-gray-900 text-white'
                          }`}
                        >
                          Man
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange('Woman')}
                          className={`py-2 px-4 rounded-md ${
                            field.value === 'Woman'
                              ? 'bg-cyan-500 text-white'
                              : 'bg-gray-900 text-white'
                          }`}
                        >
                          Woman
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange('Other')}
                          className={`py-2 px-4 rounded-md ${
                            field.value === 'Other'
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
              <div className="mb-4">
                <label
                  htmlFor="dateOfBirth"
                  className="block text-xs text-gray-400 mb-1"
                >
                  Date of Birth
                </label>
                <div className="relative">
                  <select
                    {...register('dateOfBirth')}
                    id="dateOfBirth"
                    className="w-full bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none appearance-none"
                  >
                    <option value="10/03/1998">10/03/1998</option>
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
                <p className="mt-1 text-xs text-gray-500">
                  Your age cannot be changed later
                </p>
              </div>

              {/* About Me */}
              <div className="mb-6">
                <label
                  htmlFor="aboutMe"
                  className="block text-xs text-gray-400 mb-1"
                >
                  About Me
                </label>
                <textarea
                  {...register('aboutMe')}
                  id="aboutMe"
                  rows={4}
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none"
                  placeholder="Tell us about yourself..."
                  defaultValue="Born into royalty in a realm where winter reigned eternal, she was fated to command the endless frost."
                ></textarea>
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-500">
                    153/300 Characters
                  </span>
                </div>
              </div>

              {/* Subscription Plan */}
              <div className="mb-6 bg-gray-900 p-4 rounded-md border border-gray-800">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-medium">Current Plan</h3>
                    <p className="text-cyan-400">Free</p>
                  </div>
                  <button
                    type="button"
                    className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-black px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div className="mb-6 bg-gray-900 p-4 rounded-md border border-gray-800">
                <label className="block text-xs text-gray-400 mb-2">
                  Language
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none appearance-none"
                    defaultValue="en"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
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
              <div className="mb-6 bg-gray-900 p-4 rounded-md border border-gray-800">
                <label className="block text-xs text-gray-400 mb-2">
                  Language
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-cyan-500 rounded-sm"
                    defaultChecked
                  />
                  <span className="text-sm text-gray-400">
                    You&apos;ll automatically receive notifications from us. If
                    you prefer not to, simply uncheck the box to opt out.
                  </span>
                </label>
              </div>

              {/* Delete Account */}
              <div className="mb-6 bg-gray-900 p-4 rounded-md border border-gray-800">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400">
                    If you no longer wish to use this account, you can delete it
                    along with all saved data. Please proceed with caution.
                  </p>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-400 transition-colors text-sm"
                  >
                    Delete Account
                  </button>
                </div>
              </div>

              {/* Update Button */}
              <div className="flex justify-center mb-6">
                <button
                  type="submit"
                  disabled={isUpdating || isUploading}
                  className="bg-black text-white px-8 py-2 rounded-md border border-gray-800 hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating || isUploading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </LayoutWithoutFooter>
  );
}
