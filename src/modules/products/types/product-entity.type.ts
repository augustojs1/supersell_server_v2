export class ProductEntity {
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
  created_at: Date;
  updated_at: Date;
}
