import Dexie, { Table } from 'dexie';
import {Product} from "./data";

export interface LineItem {
    id?: number;
    total: number;
    barcode:string;
    product : Product
}

export class CartDb extends Dexie {
    items!: Table<LineItem>;

    constructor() {
        super('Cart');
        this.version(1).stores({
            items: '++id,barcode' // Primary key and indexed props
        });
    }
}

export const db = new CartDb();

