import { sequelize } from '../../sequelize';
import supertest from 'supertest';
import app from '../../app';

const api = supertest(app);

test('A user can register', async () => {
  const credentials = {
    username: 'username',
    password: 'password',
  };

  await api
    .post('/auth/register')
    .send(credentials)
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

afterAll(async () => {
  await sequelize.close();
});
