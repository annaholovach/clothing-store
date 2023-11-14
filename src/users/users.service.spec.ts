import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { JwtService } from "../jwt/jwt.service";
import { DbService } from "../db/db.service";
import { ChangeRoleDto } from "./dto/change.role.dto";

describe('UsersService', () => {
    let usersService: UsersService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [UsersService, JwtService, DbService],
      }).compile();
  
      usersService = module.get<UsersService>(UsersService);
    });

    usersService = new UsersService(new DbService())
  
    it('should be defined', () => {
      expect(usersService).toBeDefined();
    })

    describe('getAll', () => {
        it('should return all users', async () => {
            const users = await usersService.getAll();
          
            expect(users.length).toBeGreaterThan(0);
        });
    })

    describe('getOne', () => {
        it('should return a user with the given ID', async () => {
            const user = await usersService.getOne(1);
            expect(user.id).toEqual(1);
          });
          
        it('should throw an error if a user with the given ID does not exist', async () => {
            await expect(usersService.getOne(100)).rejects.toThrow('user with such id does not exist');
        });
    })

    describe('changeRole', () => {
        it('should change the role of a user', async () => {
            const dto = new ChangeRoleDto() 
            dto.userId = 2
            dto.role = 'admin'
          
            const result = await usersService.changeRole(dto);
          
            expect(result).toEqual('User role changed successfully');
        });
          
          it('should throw an error if a user with the given ID does not exist', async () => {
            const dto = new ChangeRoleDto()
            dto.userId = 100
            dto.role = 'admin'
          
            await expect(usersService.changeRole(dto)).rejects.toThrow('user with such id does not exist');
        });
    })
})