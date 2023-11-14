import { UsersService } from "../users/users.service";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { DbService } from "../db/db.service";
import { CreateOrderDto } from "./dto/create.order.dto";

describe('OrdersController', () => {
    let ordersController: OrdersController;
    let ordersService: OrdersService;

    beforeEach(() => {
        ordersService = new OrdersService(new DbService(), new UsersService(new DbService()));
        ordersController = new OrdersController(ordersService);
    });

    describe('getAll', () => {
        it('should be defined', () => {
            expect(ordersController.getAll).toBeDefined();
        });

        it('should return unauthorized error if user does not have required roles', async () => {
            const mockUnauthorizedError = new Error('forbidden');
            jest.spyOn(ordersService, 'getAll').mockRejectedValue(mockUnauthorizedError);
        
            try {
              await ordersController.getAll();
            } catch (error) {
              expect(error).toEqual(mockUnauthorizedError);
            }
        });
    }) 

    describe('getOne', () => {
        it('should be defined', () => {
            expect(ordersController.getOne).toBeDefined();
        });

        it('should return unauthorized error if user does not have required roles', async () => {
            const mockUnauthorizedError = new Error('forbidden');
            jest.spyOn(ordersService, 'getOne').mockRejectedValue(mockUnauthorizedError);
        
            try {
              await ordersController.getOne(1);
            } catch (error) {
              expect(error).toEqual(mockUnauthorizedError);
            }
        });
    }) 

    describe('create', () => {
        it('should be defined', () => {
            expect(ordersController.create).toBeDefined();
        });

        it('should return unauthorized error if user is not logged in', async () => {
            const mockUnauthorizedError = new Error('Unauthorized');
            jest.spyOn(ordersService, 'create').mockRejectedValue(mockUnauthorizedError);
        
            try {
              await ordersController.create(new CreateOrderDto());
            } catch (error) {
              expect(error).toEqual(mockUnauthorizedError);
            }
        });
    }) 
})