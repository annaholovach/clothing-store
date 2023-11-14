import { FilesService } from '../files/files.service';
import { ClothingController } from './clothing.controller';
import { ClothingService } from './clothing.service';
import { DbService } from '../db/db.service';
import { CreateClothingDto } from './dto/create.clothing.dto';

describe('ClothingController', () => {
  let clothingController: ClothingController;
  let clothingService: ClothingService;

  beforeEach(() => {
    clothingService = new ClothingService(new DbService(), new FilesService());
    clothingController = new ClothingController(clothingService);
  });

  describe('getAll', () => {
    it('should be defined', () => {
      expect(clothingController.getAll).toBeDefined();
    });
  });

  describe('getById', () => {
    it('should be defined', () => {
      expect(clothingController.getById).toBeDefined();
    });
  });

  describe('findBySize', () => {
    it('should be defined', () => {
      expect(clothingController.findBySize).toBeDefined();
    });
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(clothingController.create).toBeDefined();
    });

    it('should return error if user does not have required roles', async () => {
      const mockUnauthorizedError = new Error('forbidden');
      jest
        .spyOn(clothingService, 'create')
        .mockRejectedValue(mockUnauthorizedError);

      try {
        await clothingController.create(new CreateClothingDto(), null);
      } catch (error) {
        expect(error).toEqual(mockUnauthorizedError);
      }
    });
  });

  describe('deleteById', () => {
    it('should be defined', () => {
      expect(clothingController.deleteById).toBeDefined();
    });

    it('should return error if user does not have required roles', async () => {
      const mockUnauthorizedError = new Error('forbidden');
      jest
        .spyOn(clothingService, 'deleteById')
        .mockRejectedValue(mockUnauthorizedError);

      try {
        await clothingController.deleteById(1);
      } catch (error) {
        expect(error).toEqual(mockUnauthorizedError);
      }
    });
  });
});
