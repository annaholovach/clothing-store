import { Test, TestingModule } from "@nestjs/testing";
import { OrdersService } from "./orders.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "../jwt/jwt.service";
import { DbService } from "../db/db.service";
import { CreateOrderDto } from "./dto/create.order.dto";

describe('OrdersService', () => {
    let ordersService: OrdersService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [OrdersService, UsersService, JwtService, DbService],
      }).compile();
  
      ordersService = module.get<OrdersService>(OrdersService);
    });
  
    it('should be defined', () => {
      expect(ordersService).toBeDefined();
    });

    ordersService = new OrdersService(new DbService(), new UsersService(new DbService()))

    describe('create', () => {
      it('should create a new order', async () => {
          const dto = new CreateOrderDto() 
          dto.userId = 1
          dto.items = [
              { cloth_id: 4, amount: 2 },
          ]
        
          const order = await ordersService.create(dto);
        
          expect(order.order_id).toBeGreaterThan(0);
          expect(order.userid).toEqual(1);
          expect(order.items.length).toEqual(1);
      });
        
      it('should throw an error if the user does not exist', async () => {
          const dto = {
            userId: 100,
            items: [
              { cloth_id: 1, amount: 2 },
              { cloth_id: 2, amount: 1 },
            ],
          };
        
          await expect(ordersService.create(dto)).rejects.toThrow('user with such id does not exist');
      });
    })

    describe('getAll', () => {
        it('should return all orders', async () => {
            const orders = await ordersService.getAll();
          
            expect(orders.length).toBeGreaterThan(0);
        });
    })

    describe('getOne', () => {
        it('should return an order with the given ID', async () => {
            const order = await ordersService.getOne(1);
          
            expect(order.id).toEqual(1);
          });
          
          it('should throw an error if an order with the given ID does not exist', async () => {
            await expect(ordersService.getOne(100)).rejects.toThrow('order with this id does not exist');
          });
    })

})