import { AddItemDto } from "./add.items.dto";

export class CreateOrderDto {
    readonly userId: number;
    readonly items: AddItemDto[];
}