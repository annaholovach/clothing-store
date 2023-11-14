import { FilesService } from './files.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as path from 'path'
import * as fs from 'fs'
import { Test, TestingModule } from '@nestjs/testing';

describe('FilesService', () => {
  let filesService: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesService],
    }).compile();

    filesService = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(filesService).toBeDefined();
  });

  describe('createFile', () => {
    it('should create a file and return the filename', async () => {
      const mockFile = {
        buffer: Buffer.from('ahuy'),
      };

      const fileName = await filesService.createFile(mockFile);
      expect(fileName).toBeTruthy();
      expect(fileName.length > 0).toBeTruthy();

      const filePath = path.resolve(__dirname, '..', 'static');
      expect(fs.existsSync(filePath)).toBeTruthy();
    });

    it('should throw an error if there is an error writing the file', async () => {
      const mockFile = {
        buffer: Buffer.from('ahuy'),
      };

      jest.spyOn(fs, 'writeFileSync').mockImplementation(() => { throw new Error('Error writing file'); });

      try {
        await filesService.createFile(mockFile);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
        expect(error.message).toEqual('an error occured while writing the file');
      }
    });
  });
});