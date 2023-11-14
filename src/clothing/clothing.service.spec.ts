import { Test, TestingModule } from "@nestjs/testing";
import { ClothingService } from "./clothing.service";
import { DbService } from "../db/db.service";
import { FilesService } from "../files/files.service";
import { JwtService } from "../jwt/jwt.service";
import { FilesModule } from "../files/files.module";
import { DbModule } from "../db/db.module";
import { HttpException, HttpStatus } from "@nestjs/common";
import { CreateClothingDto } from "./dto/create.clothing.dto";

describe('ClothingService', () => {
    let clothingService: ClothingService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [ClothingService, JwtService, DbService],
        imports: [FilesModule, DbModule]
      }).compile();
  
      clothingService = module.get<ClothingService>(ClothingService);
    });
  
    it('should be defined', () => {
      expect(clothingService).toBeDefined();
    });

    jest.mock('./clothing.service')

    clothingService = new ClothingService(new DbService(), new FilesService());

    describe('getAll', () => {
        it('should get all clothing items', async () => {
            const mockClothing = {
              id: 1,
              title: 'T-shirt',
              size: 'M',
              price: 100,
              description: 'This is a T-shirt',
              image: 'image.png',
            };
  
            clothingService.getAll = jest.fn(() => Promise.resolve([mockClothing]))

            const clothingItems = await clothingService.getAll();
          
            expect(clothingItems.length).toBeGreaterThan(0);
        });
    })

    describe('getById', () => {
        it('should get a clothing item by ID', async () => {
            const mockClothing = {
              id: 1,
              title: 'T-shirt',
              size: 'M',
              price: 100,
              description: 'This is a T-shirt',
              image: 'image.png',
            };

            clothingService.getById = jest.fn(() => Promise.resolve(mockClothing))
            const clothingItem = await clothingService.getById(1);
          
            expect(clothingItem.id).toEqual(1);
        });
          
        it('should throw an error if the clothing item does not exist', async () => {
            await expect(clothingService.getById(10000)).rejects.toThrow(HttpException);
            await expect(clothingService.getById(10000)).rejects.toThrowError('not found clothing with such id')
        });
    })

    describe('findBySize', () => {
        it('should get all clothing items with a specific size', async () => {
            const mockClothing = {
              id: 1,
              title: 'T-shirt',
              size: 'm',
              price: 100,
              description: 'This is a T-shirt',
              image: 'image.png',
            };

            clothingService.findBySize = jest.fn((size: string) => Promise.resolve([mockClothing]))
            const clothingItems = await clothingService.findBySize('m');
          
            expect(clothingItems.length).toBeGreaterThan(0);
          });
          
        it('should throw an error if no clothing items with the specified size exist', async () => {
            await expect(clothingService.findBySize('XXXXL')).rejects.toThrow(HttpException);
            await expect(clothingService.findBySize('XXXXL')).rejects.toThrowError('not found clothing such size')
        });
    })

    describe('deleteById', () => {
      it('should throw an error if clothing is not found', async () => {
        clothingService.getById = jest.fn(() => {
          return null;
        });
    
        const id = 100;
    
        try {
          await clothingService.deleteById(id);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.status).toEqual(HttpStatus.NOT_FOUND);
          expect(error.message).toEqual('not found clothing with such id');
        }
      });

      it('should return success message if clothing is deleted', async () => {
        const mockClothing = {
          id: 1,
          title: 'T-shirt',
          size: 'M',
          price: 100,
          description: 'This is a T-shirt',
          image: 'image.png',
        };

        clothingService.getById = jest.fn(() => Promise.resolve(mockClothing))
    
        const id = 1;
    
        const result = await clothingService.deleteById(id);
    
        expect(result).toEqual('Clothing with id: 1 deleted successful');
      });
    })

    describe('create', () => {
        it('should create a new clothing item', async () => {
            const dto = new CreateClothingDto()
            dto.title = 'T-shirt'
            dto.size = 'm'
            dto.price = 10
            dto.description = 'A white T-shirt'

            const image = {buffer: Buffer.from('something')}           
          
            const clothing = await clothingService.create(dto, image);
          
            expect(clothing.title).toEqual('T-shirt');
            expect(clothing.size).toEqual('m');
            expect(clothing.price).toEqual(10);
            expect(clothing.description).toEqual('A white T-shirt');
        });
          
        it('should throw an error if the clothing item is missing a required field', async () => {
            const dto = new CreateClothingDto()
            dto.title = 'T-shirt'
            dto.size = 'm'
            dto.price = null
            dto.description = 'A white T-shirt'

            const image = {buffer: Buffer.from('something')}
          
            await expect(clothingService.create(dto, image)).rejects.toThrowError(HttpException);
            await expect(clothingService.create(dto, image)).rejects.toThrowError('input cant be empty');
        });
    })
})