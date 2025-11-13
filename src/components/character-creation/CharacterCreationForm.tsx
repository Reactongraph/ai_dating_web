'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from '@/providers';
import { useFormContext } from 'react-hook-form';
import { CharacterFormData, FormStepProps } from '@/types/character';
import { useAppSelector } from '@/redux/hooks';
import {
  useGenerateAvatarMutation,
  GenerateAvatarRequest,
} from '@/redux/services/characterAttributesApi';

import Step1Create from './steps/Step1Create';
import Step2Ethnicity from './steps/Step2Ethnicity';
import Step3Hairstyle from './steps/Step3Hairstyle';
import Step4BodyType from './steps/Step4BodyType';
import Step5Personality from './steps/Step5Personality';
import Step6Occupation from './steps/Step6Occupation';
import Step7Relationship from './steps/Step7Relationship';
import Step8Clothing from './steps/Step8Clothing';
import Step9Summary from './steps/Step9Summary';

type CharacterCreationFormProps = Omit<FormStepProps, 'onSubmit'> & {
  onClose: () => void;
};

const CharacterCreationForm: React.FC<CharacterCreationFormProps> = ({
  currentStep,
  onNext,
  onPrevious,
  onClose,
}) => {
  const router = useRouter();
  const { handleSubmit } = useFormContext<CharacterFormData>();
  const [isGenerating, setIsGenerating] = useState(false);
  const botType = useAppSelector((state) => state.characterAttributes.botType);
  const [generateAvatar] = useGenerateAvatarMutation();
  const { showSnackbar } = useSnackbar();

  const steps = [
    { step: 1, title: 'Create' },
    { step: 2, title: 'Ethnicity & Eyes' },
    { step: 3, title: 'Hair & Age' },
    { step: 4, title: 'Body Type' },
    { step: 5, title: 'Personality' },
    { step: 6, title: 'Occupation' },
    { step: 7, title: 'Relationship' },
    { step: 8, title: 'Clothing' },
    { step: 9, title: 'Summary' },
  ];

  const CurrentStepComponent =
    steps[currentStep - 1]?.title === 'Create'
      ? Step1Create
      : steps[currentStep - 1]?.title === 'Ethnicity & Eyes'
        ? Step2Ethnicity
        : steps[currentStep - 1]?.title === 'Hair & Age'
          ? Step3Hairstyle
          : steps[currentStep - 1]?.title === 'Body Type'
            ? Step4BodyType
            : steps[currentStep - 1]?.title === 'Personality'
              ? Step5Personality
              : steps[currentStep - 1]?.title === 'Occupation'
                ? Step6Occupation
                : steps[currentStep - 1]?.title === 'Relationship'
                  ? Step7Relationship
                  : steps[currentStep - 1]?.title === 'Clothing'
                    ? Step8Clothing
                    : Step9Summary;

  const handleFormSubmit = async (data: CharacterFormData) => {
    if (currentStep < 9) {
      onNext();
      return;
    }

    // Get userId from localStorage
    const userData = localStorage.getItem('userData');
    const userId = userData ? JSON.parse(userData).id ? JSON.parse(userData).id: JSON.parse(userData)._id : null;
    if (!userId) {
      showSnackbar('User ID not found. Please log in.', 'error');
      return;
    }

    setIsGenerating(true);

    try {
      // Convert age string to number
      const ageNumber = parseInt(data.age.replace(/\D/g, '')) || 25;

      // Prepare request data
      const requestData: GenerateAvatarRequest = {
        bot_type: botType as 'girl' | 'boy',
        name: data.name,
        model: data.model,
        style: data.style === 'realistic' ? 'Realistic' : 'Anime',
        ethnicity: data.ethnicity,
        age: ageNumber,
        eye_color: data.eyeColor,
        hair_style: data.hairstyle,
        hair_color: data.hairColor,
        body_type: data.bodyType,
        personality: data.personality,
        occupation: data.occupation,
        hobbies: data.hobbies || [],
        relationship: data.relationship,
        clothing: data.clothing,
        ...(botType === 'girl' && {
          breast_size: data.breastSize,
          butt_size: data.bootySize,
        }),
      };
      const response = await generateAvatar({
        userId,
        data: requestData,
      }).unwrap();

      // On successful avatar generation, navigate to collection page
      if (response.success) {
        router.push('/my-ai');
      } else {
        showSnackbar('Failed to generate avatar', 'error');
      }
    } catch (err) {
      showSnackbar(
        err instanceof Error ? err.message : 'Failed to generate avatar',
        'error'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-auto bg-black text-white flex flex-col">
      {/* Form Header */}
      <div className="bg-black py-6 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onPrevious}
              disabled={currentStep === 1}
              className="text-white hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <h1 className="text-3xl font-bold text-center">
              Create AI Character
            </h1>

            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-black py-6 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-2">
            {steps.map((step, index) => (
              <div key={step.step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.step <= currentStep
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {step.step < currentStep ? '✓' : step.step}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      step.step < currentStep ? 'bg-primary-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <CurrentStepComponent />

            {/* Navigation Button */}
            <div className="flex flex-col items-center mt-8 mb-6">
              <button
                type="submit"
                disabled={currentStep === 9 && isGenerating}
                className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === 9
                  ? isGenerating
                    ? 'Creating Character...'
                    : 'Create Character'
                  : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreationForm;
