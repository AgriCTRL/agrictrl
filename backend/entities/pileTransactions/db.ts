import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryColumn,
    BeforeInsert,
  } from "typeorm";
  import { PalayBatch } from "../palaybatches/db";
  import { Pile } from "../piles/db";
  
  @Entity()
  export class PileTransaction extends BaseEntity {
    @PrimaryColumn("varchar", { length: 10 })
    id: string;
  
    @Column()
    palayBatchId: string;
  
    @ManyToOne(() => PalayBatch)
    palayBatch: PalayBatch;
  
    @Column()
    pileId: string;
  
    @ManyToOne(() => Pile)
    pile: Pile;
  
    @Column()
    transactionType: 'IN' | 'OUT';
  
    @Column()
    quantityBags: number;
  
    @Column()
    transactionDate: Date;
  
    @Column({ nullable: true })
    notes?: string;
  
    @Column()
    performedBy: string;
  
    @BeforeInsert()
    async generateId() {
      const prefix = "030407";
      const lastOrder = await PileTransaction.find({
        order: { id: "DESC" },
        take: 1,
      });
  
      let nextNumber = 1;
      if (lastOrder.length > 0) {
        const lastId = lastOrder[0].id;
        const lastNumber = parseInt(lastId.slice(-4));
        nextNumber = lastNumber + 1;
      }
  
      this.id = `${prefix}${nextNumber.toString().padStart(4, "0")}`;
    }
  }
  
  export type PileTransactionCreate = Pick<
    PileTransaction, 
    | "palayBatchId"
    | "pileId"
    | "transactionType"
    | "quantityBags"
    | "transactionDate"
    | "performedBy"
    | "notes"
  >;
  
  export type PileTransactionUpdate = Pick<PileTransaction, "id"> & 
    Partial<PileTransactionCreate>;
  
  function getCurrentPST(): Date {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 3600000 * 8);
  }
  
  export async function createPileTransaction(
    pileTransactionCreate: PileTransactionCreate
  ): Promise<PileTransaction> {
    const pileTransaction = new PileTransaction();
  
    // Validate PalayBatch exists
    const palayBatch = await PalayBatch.findOne({
      where: { id: pileTransactionCreate.palayBatchId }
    });
    if (!palayBatch) {
      throw new Error(`PalayBatch with id ${pileTransactionCreate.palayBatchId} not found`);
    }
  
    // Validate Pile exists
    const pile = await Pile.findOne({
      where: { id: pileTransactionCreate.pileId }
    });
    if (!pile) {
      throw new Error(`Pile with id ${pileTransactionCreate.pileId} not found`);
    }
  
    // Update Pile's current quantity based on transaction type
    if (pileTransactionCreate.transactionType === 'IN') {
      pile.currentQuantity += pileTransactionCreate.quantityBags;
    } else if (pileTransactionCreate.transactionType === 'OUT') {
      if (pile.currentQuantity < pileTransactionCreate.quantityBags) {
        throw new Error('Cannot take out more bags than currently in the pile');
      }
      pile.currentQuantity -= pileTransactionCreate.quantityBags;
    }
  
    // Save the updated pile
    await pile.save();
  
    // Update palayBatch's currentlyAt and pileId if it's an IN transaction
    if (pileTransactionCreate.transactionType === 'IN') {
      palayBatch.currentlyAt = `Pile ${pile.pileNumber}`;
      palayBatch.pileId = pile.id;
      await palayBatch.save();
    }
  
    // Set transaction details
    pileTransaction.palayBatchId = pileTransactionCreate.palayBatchId;
    pileTransaction.pileId = pileTransactionCreate.pileId;
    pileTransaction.transactionType = pileTransactionCreate.transactionType;
    pileTransaction.quantityBags = pileTransactionCreate.quantityBags;
    pileTransaction.transactionDate = pileTransactionCreate.transactionDate || getCurrentPST();
    pileTransaction.performedBy = pileTransactionCreate.performedBy;
    pileTransaction.notes = pileTransactionCreate.notes;
  
    return await pileTransaction.save();
  }
  
  export async function getPileTransactions(
    limit: number,
    offset: number
  ): Promise<{ data: PileTransaction[]; total: number }> {
    const [data, total] = await PileTransaction.findAndCount({
      take: limit,
      skip: offset,
      order: {
        transactionDate: "DESC",
        id: "DESC"
      },
      relations: {
        palayBatch: true,
        pile: true
      }
    });
  
    return { data, total };
  }
  
  export async function getPileTransactionsByPile(
    pileId: string,
    limit: number,
    offset: number
  ): Promise<{ data: PileTransaction[]; total: number }> {
    const [data, total] = await PileTransaction.findAndCount({
      where: { pileId },
      take: limit,
      skip: offset,
      order: {
        transactionDate: "DESC",
        id: "DESC"
      },
      relations: {
        palayBatch: true,
        pile: true
      }
    });
  
    return { data, total };
  }
  
  export async function getPileTransactionsByPalayBatch(
    palayBatchId: string,
    limit: number,
    offset: number
  ): Promise<{ data: PileTransaction[]; total: number }> {
    const [data, total] = await PileTransaction.findAndCount({
      where: { palayBatchId },
      take: limit,
      skip: offset,
      order: {
        transactionDate: "DESC",
        id: "DESC"
      },
      relations: {
        palayBatch: true,
        pile: true
      }
    });
  
    return { data, total };
  }