class ImageDto {
  url: string;
}

export class ProductDTO {
  id: string;
  user_id: string;
  department_id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  is_in_stock: boolean;
  average_rating: number;
  is_used: boolean;
  sales: number;
  thumbnail_image_url: string | null;
  created_at: Date;
  updated_at: Date;
  images: ImageDto[];
}
