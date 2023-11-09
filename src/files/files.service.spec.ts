import { FilesService } from './files.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as path from 'path'
import * as fs from 'fs'
import { error } from 'console';

describe('FilesService', () => {
  let filesService: FilesService;

  beforeEach(() => {
    filesService = new FilesService();
  });

  describe('createFile', () => {
    it('should create a file and return the filename', async () => {
      const mockFile = {
        buffer: new Buffer('<Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 02 00 00 00 02 00 08 06 00 00 00 f4 78 d4 fa 00 00 20 00 49 44 41 54 78 9c ec bd d9 92 e4 46 96>'),
      };

      const fileName = await filesService.createFile(mockFile);
      expect(fileName).toBeTruthy();
      expect(fileName.length > 0).toBeTruthy();

      const filePath = path.resolve(__dirname, '..', 'static', fileName);
      expect(fs.existsSync(filePath)).toBeTruthy();
    });

    it('should throw an error if there is an error writing the file', async () => {
      const mockFile = {
        buffer: new Buffer('<Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 02 00 00 00 02 00 08 06 00 00 00 f4 78 d4 fa 00 00 20 00 49 44 41 54 78 9c ec bd d9 92 e4 46 96>'),
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