import { sequelize, User } from '../../sequelize';
import supertest from 'supertest';
import app from '../../app';

const api = supertest(app);

test('A user can register', async () => {
  const credentials = {
    username: 'user1',
    password: 'password',
  };

  await api
    .post('/auth/register')
    .send(credentials)
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('User can login', async () => {
  const credentials = {
    username: 'user1',
    password: 'password',
  };

  const response = await api
    .post('/auth/login')
    .send(credentials)
    .expect('Content-type', /application\/json/)
    .expect(200);

  expect(response.body.token).not.toBeUndefined();
});

afterAll(async () => {
  // delete user
  const user = await User.findOne({ where: { username: 'user1' } });
  await user?.destroy();

  await sequelize.close();
});
