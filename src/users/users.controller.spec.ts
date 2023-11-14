import { DbService } from '../db/db.service';
import { ChangeRoleDto } from './dto/change.role.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService(new DbService());
    usersController = new UsersController(usersService);
  });

  describe('getAll', () => {
    it('should be defined', () => {
      expect(usersController.getAll).toBeDefined();
    });

    it('should return error if user does not have required roles', async () => {
      const mockUnauthorizedError = new Error('forbidden');
      jest
        .spyOn(usersService, 'getAll')
        .mockRejectedValue(mockUnauthorizedError);

      try {
        await usersController.getAll();
      } catch (error) {
        expect(error).toEqual(mockUnauthorizedError);
      }
    });
  });

  describe('getOne', () => {
    it('should be defined', () => {
      expect(usersController.getOne).toBeDefined();
    });

    it('should return error if user does not have required roles', async () => {
      const mockUnauthorizedError = new Error('forbidden');
      jest
        .spyOn(usersService, 'getOne')
        .mockRejectedValue(mockUnauthorizedError);

      try {
        await usersController.getOne(1);
      } catch (error) {
        expect(error).toEqual(mockUnauthorizedError);
      }
    });
  });

  describe('changeRole', () => {
    it('should be defined', () => {
      expect(usersController.changeRole).toBeDefined();
    });

    it('should return error if user does not have required roles', async () => {
      const mockUnauthorizedError = new Error('forbidden');
      jest
        .spyOn(usersService, 'changeRole')
        .mockRejectedValue(mockUnauthorizedError);

      try {
        await usersController.changeRole(new ChangeRoleDto());
      } catch (error) {
        expect(error).toEqual(mockUnauthorizedError);
      }
    });
  });
});
