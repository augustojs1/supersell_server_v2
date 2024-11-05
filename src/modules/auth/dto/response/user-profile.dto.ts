export class UserProfileDto {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  average_rating: number;
  avatar_url: string | null;
  phone_number: string | null;
  created_at: Date;
  updated_at: Date;
}
