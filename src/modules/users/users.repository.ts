import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { ulid } from 'ulid';

import * as schema from '@/infra/database/orm/drizzle/schema';
import { DATABASE_TAG } from '@/infra/database/orm/drizzle/drizzle.module';
import { CreateUserDto } from './dto/request/create-user.dto';
import { ProfileEntity, UserEntity } from './types';
import { UserProfileDto } from '../auth/dto';
import { UpdateUserProfileDto } from './dto';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DATABASE_TAG)
    private readonly drizzle: MySql2Database<typeof schema>,
  ) {}

  public async create(user: CreateUserDto): Promise<UserEntity> {
    const id = ulid();

    await this.drizzle.insert(schema.users).values({
      id: id,
      ...user,
    });

    return this.findUserByEmail(user.email);
  }

  public async createProfile(user_id: string): Promise<void> {
    await this.drizzle.insert(schema.profiles).values({
      id: ulid(),
      user_id: user_id,
    });
  }

  public async findUserByEmail(email: string): Promise<UserEntity | null> {
    const users = await this.drizzle
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    return users[0] ?? null;
  }

  public async findById(id: string): Promise<UserEntity | null> {
    const users = await this.drizzle
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));

    return users[0] ?? null;
  }

  public async findUserWithProfile(id: string): Promise<UserProfileDto | null> {
    const userProfile = await this.drizzle
      .select({
        id: schema.users.id,
        first_name: schema.users.first_name,
        last_name: schema.users.last_name,
        email: schema.users.email,
        average_rating: schema.profiles.average_rating,
        avatar_url: schema.profiles.avatar_url,
        phone_number: schema.profiles.phone_number,
        created_at: schema.users.created_at,
        updated_at: schema.users.updated_at,
      })
      .from(schema.users)
      .innerJoin(schema.profiles, eq(schema.users.id, schema.profiles.user_id))
      .where(eq(schema.profiles.user_id, id));

    return userProfile[0] || null;
  }

  public async updateProfile(
    id: string,
    data: UpdateUserProfileDto,
  ): Promise<void> {
    await this.drizzle
      .update(schema.profiles)
      .set({
        phone_number: data.phone_number,
      } as any)
      .where(eq(schema.profiles.user_id, id));
  }

  public async updateAvatar(id: string, url: string): Promise<void> {
    await this.drizzle
      .update(schema.profiles)
      .set({
        avatar_url: url,
      } as ProfileEntity)
      .where(eq(schema.profiles.user_id, id));
  }

  public async createUserAndShoppingCartTrx(
    user: CreateUserDto,
  ): Promise<void> {
    await this.drizzle.transaction(async (tx) => {
      try {
        // First operation
        const userId = ulid();

        await tx.insert(schema.users).values({
          id: userId,
          ...user,
        });

        // Second operation
        const shoppingCartId = ulid();

        await tx.insert(schema.shopping_carts).values({
          id: shoppingCartId,
          user_id: userId,
        });
      } catch (error) {
        throw error;
      }
    });
  }
}
