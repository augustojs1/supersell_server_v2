import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { File } from '@nest-lab/fastify-multer';
import { ulid } from 'ulid';
import { eq, sql } from 'drizzle-orm';
import { MySql2Database } from 'drizzle-orm/mysql2';

import * as schemas from '@/infra/database/orm/drizzle/schema';
import { ProductsRepository } from './products.repository';
import {
  CreateProductDto,
  DepartmentProductsDTO,
  ProductDTO,
  UpdateProductDto,
} from './dto';
import { ProductEntity } from './types';
import { DepartmentsService } from '../departments/departments.service';
import { ProductsImagesService } from '../products_images/products_images.service';
import { ProductImages } from './types/product-images.type';
import {
  PaginationParamsDto,
  PaginationParamsSortableDto,
} from '@/modules/common/dto';
import { ProductsTextResultDto } from './dto/response/products-text-result.dto';
import { SlugProvider } from './providers/slug.provider';
import { DATABASE_TAG } from '@/infra/database/orm/drizzle/drizzle.module';
import { IStorageService } from '@/infra/storage/istorage.service.interface';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @Inject(DATABASE_TAG)
    private readonly trxManager: MySql2Database<typeof schemas>,
    private readonly productsRepository: ProductsRepository,
    private readonly productImagesService: ProductsImagesService,
    private readonly departmentsService: DepartmentsService,
    private readonly slugService: SlugProvider,
    private readonly storageService: IStorageService,
  ) {}

  public async create(
    user_id: string,
    data: CreateProductDto,
    product_images: ProductImages,
  ): Promise<any> {
    this.logger.log(`Creating produt ${data.name} for user ${user_id}`);

    const product = await this.productsRepository.findByName(data.name);

    if (product) {
      throw new HttpException(
        'Product with this name already exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const productSku = await this.productsRepository.findBySkuAndUserId(
      data.sku,
      user_id,
    );

    if (productSku) {
      throw new HttpException(
        'Product with this SKU already exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const department = await this.departmentsService.findById(
      data.department_id,
    );

    if (!department) {
      throw new HttpException(
        'Department with this id does not exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!department.parent_department_id) {
      throw new HttpException(
        'Product can not be related to a parent department!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const productSlug = this.slugService.slugify(data.name);

    data.slug = productSlug;

    return await this.createProductAndSetImagesFlowTrx(
      user_id,
      data,
      product_images,
    );
  }

  public async createProductAndSetImagesFlowTrx(
    user_id: string,
    data: CreateProductDto,
    product_images: ProductImages,
  ) {
    this.logger.log(`Init creating product transaction flow:: ${data}`);

    return await this.trxManager.transaction(async (tx) => {
      try {
        const productId = ulid();

        const thumbnailUrl = await this.storageService.upload(
          product_images.thumbnail_image[0],
          `user_${user_id}/products/product_${productId}`,
        );

        await tx.insert(schemas.products).values({
          id: productId,
          department_id: data.department_id,
          user_id: user_id,
          name: data.name,
          description: data.description,
          sku: data.sku,
          slug: data.slug,
          thumbnail_image_url: thumbnailUrl,
          price: parseFloat(data.price),
          is_used: data.is_used,
          quantity: parseInt(data.quantity),
        });

        this.logger.log(
          'Uploading image to S3 and inserting into product_images table',
        );

        for (const image of product_images.images) {
          const url = await this.storageService.upload(
            image,
            `user_${user_id}/products/product_${productId}/images`,
          );

          await tx.insert(schemas.products_images).values({
            id: ulid(),
            product_id: productId,
            url: url,
          });
        }

        this.logger.log!(`Succesfully created product ${JSON.stringify(data)}`);

        return tx
          .select({
            id: schemas.products.id,
            user_id: schemas.products.user_id,
            department_id: schemas.products.department_id,
            name: schemas.products.name,
            description: schemas.products.description,
            price: schemas.products.price,
            quantity: schemas.products.quantity,
            is_in_stock: schemas.products.is_in_stock,
            average_rating: schemas.products.average_rating,
            is_used: schemas.products.is_used,
            sales: schemas.products.sales,
            thumbnail_image_url: schemas.products.thumbnail_image_url,
            created_at: schemas.products.created_at,
            updated_at: schemas.products.updated_at,
            images:
              sql<JSON>`JSON_ARRAYAGG(JSON_OBJECT('url', ${schemas.products_images.url}, 'id', ${schemas.products_images.id}))`.as(
                'images',
              ),
          })
          .from(schemas.products)
          .leftJoin(
            schemas.products_images,
            eq(schemas.products_images.product_id, schemas.products.id),
          )
          .where(eq(schemas.products.id, productId))
          .groupBy(schemas.products.id);
      } catch (error) {
        this.logger.error(
          `ERROR while creating product:: ${JSON.stringify(error)}`,
        );
        throw new InternalServerErrorException(error);
      }
    });
  }

  public async findByDepartmentId(
    department_id: string,
    paginationParams: PaginationParamsSortableDto,
  ): Promise<any> {
    const department = await this.departmentsService.findById(department_id);

    if (!department) {
      throw new HttpException(
        'Department with this id does not exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!department.parent_department_id) {
      return await this.productsRepository.findByParentDepartmentId(
        department_id,
        paginationParams,
      );
    }

    return await this.productsRepository.findByDepartmentId(
      department_id,
      paginationParams,
    );
  }

  public async findUserProducts(
    user_id: string,
    paginationParams: PaginationParamsDto,
  ): Promise<DepartmentProductsDTO> {
    return await this.productsRepository.findByUserId(
      user_id,
      paginationParams,
    );
  }

  public async findById(id: string): Promise<ProductEntity | null> {
    return await this.productsRepository.findById(id);
  }

  public async checkProductOwnershipElseThrow(
    user_id: string,
    product_id: string,
  ): Promise<void> {
    const product = await this.findByIdElseThrow(product_id);

    if (product.user_id !== user_id) {
      throw new HttpException('Action not allowed', HttpStatus.FORBIDDEN);
    }
  }

  public async findByIdElseThrow(id: string) {
    const product = await this.findById(id);

    if (!product) {
      throw new HttpException(
        'Product with this id does not exists!',
        HttpStatus.BAD_REQUEST,
      );
    }

    return product;
  }

  public async updateProduct(
    user_id: string,
    product_id: string,
    data: UpdateProductDto,
  ): Promise<void> {
    const product = await this.findByIdElseThrow(product_id);

    await this.checkProductOwnershipElseThrow(user_id, product.id);

    await this.productsRepository.updateProduct(product.id, data);
  }

  public async delete(user_id: string, product_id: string): Promise<void> {
    const product = await this.findByIdElseThrow(product_id);

    await this.checkProductOwnershipElseThrow(user_id, product.id);

    await this.productsRepository.deleteProduct(product_id);
  }

  public async addImages(
    user_id: string,
    product_id: string,
    images: File[],
  ): Promise<any> {
    const product = await this.findByIdElseThrow(product_id);

    await this.checkProductOwnershipElseThrow(user_id, product.id);

    const productImages = await this.productImagesService.create(
      user_id,
      product_id,
      images,
    );

    return productImages;
  }

  public async findByName(name: string): Promise<ProductsTextResultDto[]> {
    return await this.productsRepository.findAllByName(name);
  }

  public async findByIdWithImages(product_id: string): Promise<ProductDTO> {
    await this.findByIdElseThrow(product_id);

    return await this.productsRepository.findByIdWithImages(product_id);
  }

  public async updateQuantity(
    product_id: string,
    amount: number,
  ): Promise<void> {
    if (amount === 0) {
      await this.setProductIsInStock(product_id, false);
    }

    await this.productsRepository.updateQuantity(product_id, amount);
  }

  public async setProductIsInStock(product_id: string, is_in_stock: boolean) {
    await this.productsRepository.setProductIsInStock(product_id, is_in_stock);
  }
}
