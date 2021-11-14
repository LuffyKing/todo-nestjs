import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let userService: UsersService;

  let repo: typeof mockRepository;

  let returnedUser;

  const userDetails = {
    id: 7,
    firstName: 'Damola',
    lastName: 'Aderinwale',
    email: 'aderinwale@gmail.com',
    password: 'somepassword',
  };

  const mockRepository = {
    findOne: jest.fn((findOptions) => findOptions),
    update: jest.fn((updateCriteria, updateObject) => updateObject),
    remove: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockRepository,
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(Users));
    returnedUser = {
      id: 7,
      firstName: 'Damola',
      lastName: 'Aderinwale',
      email: 'aderinwale@gmail.com',
      permission_level: 1,
    };
  });

  describe('create', () => {
    it('should return a created user without a password', async () => {
      repo.save.mockResolvedValue(returnedUser);
      repo.findOne.mockReturnValue(undefined);
      const user = await userService.create(userDetails, 1);
      expect(user).toEqual(returnedUser);
      expect(user).not.toHaveProperty('password');
    });
    it('should not create an already existing user', async () => {
      repo.findOne.mockReturnValue(returnedUser);
      await expect(userService.create(userDetails, 1)).rejects.toThrowError(
        new BadRequestException(
          `The user with email ${userDetails.email} already exists`,
        ),
      );
    });
  });

  describe('findOne', () => {
    it('should find an existing user', async () => {
      repo.findOne.mockReturnValue(returnedUser);
      const user = await userService.findOne(userDetails.email);
      expect(user).toEqual(returnedUser);
    });
    it('should not find a user that does not exist', async () => {
      repo.findOne.mockReturnValue(undefined);
      const user = await userService.findOne(userDetails.email);
      expect(user).toBe(undefined);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const changeUserDetails = {
        email: 'damola@gmail.com',
      };
      const updatedUserDetails = { ...returnedUser, ...changeUserDetails };
      repo.findOne.mockReturnValue(returnedUser);
      repo.save.mockResolvedValue(updatedUserDetails);
      const user = await userService.update(
        userDetails.email,
        changeUserDetails,
      );
      expect(user).toEqual(updatedUserDetails);
    });
    it('should not find update that does not exist', async () => {
      const changeUserDetails = {
        email: 'damola@gmail.com',
      };
      repo.findOne.mockReturnValue(undefined);
      await expect(
        userService.update(userDetails.email, changeUserDetails),
      ).rejects.toThrowError(
        new NotFoundException(
          `The user with email ${userDetails.email} does not exist`,
        ),
      );
    });
  });

  describe('remove', () => {
    it('should remove an existing user', async () => {
      repo.findOne.mockReturnValue(returnedUser);
      repo.remove.mockResolvedValue(returnedUser);
      const user = await userService.remove('aderinwale17@gmail.com');
      expect(user).toEqual(returnedUser);
    });
    it('should not find update that does not exist', async () => {
      const email = 'nobody@gmail.com';
      repo.findOne.mockReturnValue(undefined);
      await expect(userService.remove(email)).rejects.toThrowError(
        new NotFoundException(`The user with email ${email} does not exist`),
      );
    });
  });
});
