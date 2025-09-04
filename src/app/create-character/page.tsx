'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import CharacterCreationForm from '@/components/character-creation/CharacterCreationForm';
import { CharacterFormData } from '@/types/character';
import CreateCompanionCard from '@/components/cards/CreateCompanionCard';
import ConfirmationModal from '@/components/common/ConfirmationModal';

const CreateCharacterPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showCloseModal, setShowCloseModal] = useState(false);

  const methods = useForm<CharacterFormData>({
    defaultValues: {
      // Step 1: Create
      characterType: 'girl',
      style: 'realistic',

      // Step 2: Ethnicity and Eye Color
      ethnicity: 'caucasian',
      eyeColor: 'blue',

      // Step 3: Hairstyle, Color, Age
      hairstyle: 'ponytail',
      hairColor: 'brown',
      age: '30s',

      // Step 4: Body Type
      bodyType: 'petite',
      breastSize: 'medium',
      bootySize: 'medium',

      // Step 5: Personality
      personality: 'caregiver',

      // Step 6: Occupation and Hobbies
      occupation: 'student',
      hobbies: [],

      // Step 7: Relationship
      relationship: 'stranger',

      // Step 8: Clothing
      clothing: 'casual',

      // Step 9: Summary
      // This will be auto-generated from previous selections
    },
  });

  // Initialize step from URL or default to 1
  useEffect(() => {
    const step = searchParams.get('step');
    if (step) {
      const stepNumber = parseInt(step);
      if (stepNumber >= 1 && stepNumber <= 9) {
        setCurrentStep(stepNumber);
        setShowForm(true);
      }
    }
  }, [searchParams]);

  const goToStep = (step: number) => {
    setCurrentStep(step);
    router.push(`/create-character?step=${step}`);
  };

  const goToNextStep = () => {
    if (currentStep < 9) {
      goToStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const onSubmit = (data: CharacterFormData) => {
    console.log('Form submitted:', data);
    // Here you would typically send data to your API
    alert('Character created successfully!');
  };

  const handleStartCreating = () => {
    setShowForm(true);
    goToStep(1);
  };

  const handleClose = () => {
    setShowCloseModal(true);
  };

  const handleConfirmClose = () => {
    // Reset form data
    methods.reset({
      // Step 1: Create
      characterType: 'girl',
      style: 'realistic',

      // Step 2: Ethnicity and Eye Color
      ethnicity: 'caucasian',
      eyeColor: 'blue',

      // Step 3: Hairstyle, Color, Age
      hairstyle: 'ponytail',
      hairColor: 'brown',
      age: '30s',

      // Step 4: Body Type
      bodyType: 'petite',
      breastSize: 'medium',
      bootySize: 'medium',

      // Step 5: Personality
      personality: 'caregiver',

      // Step 6: Occupation and Hobbies
      occupation: 'student',
      hobbies: [],

      // Step 7: Relationship
      relationship: 'stranger',

      // Step 8: Clothing
      clothing: 'casual',
    });

    // Reset state and navigate back to landing page
    setShowForm(false);
    setCurrentStep(1);
    setShowCloseModal(false);
    router.push('/create-character');
  };

  const handleCancelClose = () => {
    setShowCloseModal(false);
  };

  if (!showForm) {
    return (
      <div className="h-full bg-black text-white flex flex-col">
        {/* Landing Header */}
        <div className="bg-black py-8 flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">
              Build Your Perfect AI Companion
            </h1>
            <p className="text-xl text-white/90">
              From style to soul, design a character that fits your world.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center w-[355px] items-center">
              <CreateCompanionCard
                onClick={handleStartCreating}
                buttonText="Start Creating"
                title="Ready to build your perfect AI companion?"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <CharacterCreationForm
        currentStep={currentStep}
        onNext={goToNextStep}
        onPrevious={goToPreviousStep}
        onSubmit={onSubmit}
        onClose={handleClose}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCloseModal}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
        title="Are you sure you want to cancel persona creation process and exit?"
        message=""
        confirmText="Cancel and exit"
        cancelText="Continue creating"
        confirmButtonVariant="danger"
      />
    </FormProvider>
  );
};

export default CreateCharacterPage;
