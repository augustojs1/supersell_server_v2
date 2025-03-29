export class CreatedProductResponseDto {
  id: string;
  user_id: string;
  department_id: string;
  name: string;
  description: string;
  price: string;
  quantity: number;
  is_in_stock: boolean;
  average_rating: string;
  is_used: boolean;
  sales: number;
  thumbnail_image_url: string;
  created_at: string | Date;
  updated_at: string | Date;
  images: {
    id: string;
    url: string;
  }[];
}
