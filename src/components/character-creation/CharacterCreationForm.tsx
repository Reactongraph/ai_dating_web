'use client';

import { useFormContext } from 'react-hook-form';
import { CharacterFormData, FormStepProps } from '@/types/character';

import Step1Create from './steps/Step1Create';
import Step2Ethnicity from './steps/Step2Ethnicity';
import Step3Hairstyle from './steps/Step3Hairstyle';
import Step4BodyType from './steps/Step4BodyType';
import Step5Personality from './steps/Step5Personality';
import Step6Occupation from './steps/Step6Occupation';
import Step7Relationship from './steps/Step7Relationship';
import Step8Clothing from './steps/Step8Clothing';
import Step9Summary from './steps/Step9Summary';

type CharacterCreationFormProps = FormStepProps;

const CharacterCreationForm: React.FC<CharacterCreationFormProps> = ({
  currentStep,
  onNext,
  onPrevious,
  onSubmit,
}) => {
  const { handleSubmit } = useFormContext<CharacterFormData>();

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

  const handleFormSubmit = (data: CharacterFormData) => {
    if (currentStep < 9) {
      onNext();
    } else {
      onSubmit(data);
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

            <button className="text-white hover:text-gray-200">
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
            <div className="flex justify-center mt-8 mb-6">
              <button
                type="submit"
                className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === 9 ? 'Submit' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreationForm;
