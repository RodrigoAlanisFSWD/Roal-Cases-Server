import {Category} from 'src/categories/category/category.entity';
import {SubCategory} from 'src/subcategories/subcategory/subcategory.entity';

export class SearchDTO {
  subCategories?: string[];
  query?: string;
  category?: Category;
}
