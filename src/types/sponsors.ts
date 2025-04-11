
export type Sponsor = {
  id: string;
  company_name: string;
  logo_url: string;
  sponsorship_level: SponsorshipLevel;
  description: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  user_id?: string;
  created_at?: string;
  status?: SponsorStatus;
};

export type SponsorshipLevel = 'bronze' | 'silver' | 'gold' | 'platinum';
export type SponsorStatus = 'pending' | 'approved' | 'rejected';

// Extended animal species list with many more options
export type ExtendedAnimalSpecies = 
  | 'dog' 
  | 'cat' 
  | 'bird' 
  | 'rabbit' 
  | 'squirrel' 
  | 'raccoon' 
  | 'deer' 
  | 'fox' 
  | 'turtle' 
  | 'snake' 
  | 'possum' 
  | 'beaver' 
  | 'skunk' 
  | 'hedgehog'
  | 'hamster'
  | 'guinea pig'
  | 'ferret'
  | 'lizard'
  | 'mouse'
  | 'rat'
  | 'chipmunk'
  | 'frog'
  | 'toad'
  | 'salamander'
  | 'hawk'
  | 'owl'
  | 'eagle'
  | 'duck'
  | 'goose'
  | 'swan'
  | 'pigeon'
  | 'crow'
  | 'seagull'
  | 'coyote'
  | 'wolf'
  | 'bear'
  | 'moose'
  | 'armadillo'
  | 'opossum'
  | 'other';

// Type guard to check if an object is a Sponsor
export function isSponsor(obj: any): obj is Sponsor {
  return (
    obj &&
    typeof obj === 'object' &&
    'company_name' in obj &&
    'logo_url' in obj &&
    'sponsorship_level' in obj
  );
}
