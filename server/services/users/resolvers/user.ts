import User from '../entity/user';
import {
  Arg,
  Ctx,
  Resolver,
  Query,
  Mutation,
  InputType,
  Field,
  Int,
  UseMiddleware
} from 'type-graphql';
import { Context } from '../../../types';
import { verify } from 'argon2';
import { isAuth } from '../../../middleware/isAuth';

@InputType()
class RegisterUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@Resolver(User)
class UserResolver {
  @Mutation(() => User)
  async register(@Arg('input') input: RegisterUserInput) {
    try {
      return await User.create({ ...input }).save();
    } catch (err) {
      throw err;
    }
  }

  @Mutation(() => User)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: Context
  ): Promise<User> {
    try {
      const query = usernameOrEmail.includes('@')
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } };

      const user = await User.findOne(query);

      if (user) {
        const passwordsMatch = await verify(user.password, password);

        if (!passwordsMatch) throw new Error('Wrong password');
        req.session.userId = user.id;
        return user;
      } else {
        throw new Error('Could not find a user with the given credentials');
      }
    } catch (err) {
      throw err;
    }
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: Context): Promise<User | null | undefined> {
    if (!req.session.userId) return null;
    return await User.findOne(req.session.userId);
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context) {
    return new Promise(resolve =>
      req.session.destroy((err: any) => {
        res.clearCookie('user');

        if (err) {
          console.log(err);
          return resolve(false);
        }

        return resolve(true);
      })
    );
  }

  @Query(() => User)
  @UseMiddleware(isAuth)
  async findById(@Arg('id', () => Int) id: number): Promise<User | undefined> {
    try {
      return await User.findOneOrFail({ id });
    } catch (err) {
      throw err;
    }
  }
}

export default UserResolver;
