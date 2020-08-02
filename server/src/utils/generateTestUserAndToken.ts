import { v4 as uuidv4 } from "uuid";
import { User } from "../sequelize";
import jwt from "jsonwebtoken";

export interface TestUser {
  token: string;
  user: any;
}

export const generateTestUserAndToken = async (): Promise<TestUser> => {
  const user: any = await User.create({
    username: "test",
    password: "password",
    id: uuidv4()
  });

  const token = jwt.sign(
    { username: user.username, id: user.id },
    process.env.TOKEN_SECRET as string
  );

  return { token, user };
};

export const removeTestUser = async () => {
  const user = await User.findOne({ where: { username: "test" } });
  if (!user) {
    return;
  }

  await user.destroy();
};
