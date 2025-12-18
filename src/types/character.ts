export interface CharacterFormData {
  // Step 1: Create
  characterType: 'girl' | 'guy' | 'anime';
  style: 'realistic' | 'anime';

  // Step 2: Ethnicity and Eye Color
  ethnicity: 'caucasian' | 'latina' | 'asian' | 'middle-eastern' | 'african' | 'native-american';
  eyeColor: 'blue' | 'green' | 'brown' | 'hazel' | 'gray';

  // Step 3: Hairstyle, Color, Age
  hairstyle: 'ponytail' | 'braid' | 'bun' | 'straight' | 'wavy' | 'curly' | 'short';
  hairColor: 'blonde' | 'brown' | 'black' | 'red' | 'gray' | 'white' | 'blue' | 'pink' | 'purple';
  age: '18+' | '20s' | '30s' | '40s' | '50s' | 'custom';

  // Step 4: Body Type
  bodyType: 'petite' | 'slim' | 'athletic' | 'curvy' | 'voluptuous';
  breastSize: 'flat' | 'small' | 'medium' | 'large' | 'huge';
  bootySize: 'small' | 'medium' | 'large' | 'athletic' | 'curvy';

  // Step 5: Personality
  personality:
    | 'caregiver'
    | 'naughty'
    | 'shy'
    | 'temptress'
    | 'jester'
    | 'mistress'
    | 'dominant'
    | 'submissive';

  // Step 6: Occupation and Hobbies
  occupation:
    | 'student'
    | 'teacher'
    | 'doctor'
    | 'engineer'
    | 'artist'
    | 'business'
    | 'service'
    | 'other';
  hobbies: string[];

  // Step 7: Relationship
  relationship:
    | 'stranger'
    | 'friend'
    | 'bestfriend'
    | 'girlfriend'
    | 'wife'
    | 'mistress'
    | 'colleague'
    | 'schoolmate'
    | 'stepsister'
    | 'stepmom';

  // Step 8: Clothing
  clothing: 'casual' | 'formal' | 'sporty' | 'elegant' | 'sexy' | 'bikini' | 'uniform' | 'costume';

  // Step 9: Summary (auto-generated)
  summary?: string;
  name: string;
  model?: 'lustify-sdxl' | 'flux-dev-uncensored' | 'pony-realism' | 'qwen-image' | 'venice-sd35'; // Optional - now using contentMode from navbar
}

export interface StepConfig {
  step: number;
  title: string;
  description?: string;
  component: React.ComponentType<FormStepProps>;
}

export interface FormStepProps {
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: (data: CharacterFormData) => void;
}
