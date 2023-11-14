import { AddItemDto } from "./add.items.dto";

export class CreateOrderDto {
    userId: number;
    items: AddItemDto[];
}