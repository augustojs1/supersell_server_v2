export class DepartmentEntity {
  id: string;
  parent_department_id: string | null;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}
