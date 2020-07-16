import { Model } from 'sequelize/types';

import sequelize from 'sequelize';

export interface UserAttributes {
  id: string;
  username: string;
  password: string;
  avatar: string | null;
}

class User extends sequelize.Model<UserAttributes> implements UserAttributes {
  public id!: string;
  public username!: string;
  public password!: string;
  public avatar!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default User;
