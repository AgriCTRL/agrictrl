import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  BeforeInsert,
} from "typeorm";
import { Warehouse } from "../warehouses/db";
import { PalayBatch } from "../palaybatches/db";

function getMonthsDifference(startDate: Date, endDate: Date): number {
  const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                    (endDate.getMonth() - startDate.getMonth());
  return Math.max(0, monthsDiff);
}

async function updatePalayBatchAges(palayBatches: PalayBatch[]): Promise<void> {
  const currentDate = new Date();
  
  for (const batch of palayBatches) {
    const age = getMonthsDifference(batch.dateBought, currentDate);
    await PalayBatch.update(batch.id, { age });
  }
}

@Entity()
export class Pile extends BaseEntity {
  @PrimaryColumn("varchar", { length: 10 })
  id: string;

  @Column()
  warehouseId: string;

  @Column()
  pileNumber: string;

  @ManyToOne(() => Warehouse)
  warehouse: Warehouse;

  @Column()
  maxCapacity: number;

  @Column()
  currentQuantity: number;

  @Column()
  description: string;

  @Column()
  status: string;

  @Column()
  type: string;

  @Column()
  age: number;

  @Column({ nullable: true })
  price: number;

  @Column({ default: false })
  forSale: boolean;


  @OneToMany(() => PalayBatch, (palayBatch) => palayBatch.pile)
  palayBatches: PalayBatch[];

  @BeforeInsert()
  async generateId() {
    const prefix = "030406";
    const lastOrder = await Pile.find({
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

  pbTotal?: number;
}

export type PileCreate = Pick<
  Pile,
  "warehouseId" | "pileNumber" | "maxCapacity" | "currentQuantity" | "description" | "status" | "type" | "age" | "price" | "forSale"
>;

export type PileUpdate = Pick<Pile, "id"> & Partial<PileCreate>;

export async function getPiles(
  limit: number,
  offset: number,
  pbLimit?: number,
  pbOffset?: number
): Promise<{ data: Pile[]; total: number }> {
  const [data, total] = await Pile.findAndCount({
    take: limit,
    skip: offset,
    relations: {
      palayBatches: {
        qualitySpec: true
      }
    },
  });

  // Update ages and process pagination
  for (const pile of data) {
    pile.age = await updatePileAge(pile.id);
    pile.pbTotal = pile.palayBatches?.length || 0;

    if (pbLimit !== undefined && pbOffset !== undefined && pile.palayBatches) {
      pile.palayBatches = pile.palayBatches.slice(pbOffset, pbOffset + pbLimit);
    }
  }

  return { data, total };
}

export async function getPile(
  id: string,
  pbLimit?: number,
  pbOffset?: number
): Promise<Pile | null> {
  const pile = await Pile.findOne({
    where: {
      id,
    },
    relations: {
      palayBatches: {
        qualitySpec: true
      }
    },
  });

  if (pile) {
    // Update ages before returning
    pile.age = await updatePileAge(pile.id);
    
    // Store total count before pagination
    pile.pbTotal = pile.palayBatches?.length || 0;

    // Apply pagination if parameters are provided
    if (pbLimit !== undefined && pbOffset !== undefined) {
      pile.palayBatches = pile.palayBatches.slice(pbOffset, pbOffset + pbLimit);
    }
  }

  return pile;
}

export async function getPilesByWarehouse(
  warehouseId: string,
  limit: number,
  offset: number,
  pbLimit?: number,
  pbOffset?: number
): Promise<{ data: Pile[]; total: number }> {
  const [data, total] = await Pile.findAndCount({
    where: {
      warehouseId,
    },
    take: limit,
    skip: offset,
    relations: {
      palayBatches: {
        qualitySpec: true
      }
    },
  });

  // Update ages and process pagination for each pile
  for (const pile of data) {
    // Update age before returning
    pile.age = await updatePileAge(pile.id);
    
    // Store total count before pagination
    pile.pbTotal = pile.palayBatches?.length || 0;

    // Apply pagination to palayBatches if parameters are provided
    if (pbLimit !== undefined && pbOffset !== undefined && pile.palayBatches) {
      pile.palayBatches = pile.palayBatches.slice(pbOffset, pbOffset + pbLimit);
    }
  }

  return { data, total };
}

export async function createPile(pileCreate: PileCreate): Promise<Pile> {
  const pile = new Pile();

  pile.warehouseId = pileCreate.warehouseId;
  pile.pileNumber = pileCreate.pileNumber;
  pile.maxCapacity = pileCreate.maxCapacity;
  pile.currentQuantity = pileCreate.currentQuantity;
  pile.description = pileCreate.description;
  pile.status = pileCreate.status;
  pile.type = pileCreate.type;
  pile.age = 0; // Initialize age as 0 for new piles
  pile.price = pileCreate.price;
  pile.forSale = pileCreate.forSale;

  return await pile.save();
}

export async function updatePileAges(): Promise<void> {
  const piles = await Pile.find({
    relations: { palayBatches: true }
  });
  
  for (const pile of piles) {
    await updatePileAge(pile.id);
  }
}

export async function updatePile(pileUpdate: PileUpdate): Promise<Pile> {
  await Pile.update(pileUpdate.id, {
    maxCapacity: pileUpdate.maxCapacity,
    pileNumber: pileUpdate.pileNumber,
    currentQuantity: pileUpdate.currentQuantity,
    description: pileUpdate.description,
    status: pileUpdate.status,
    type: pileUpdate.type,
    age: pileUpdate.age,
    price: pileUpdate.price,
    forSale: pileUpdate.forSale,
  });

  const pile = await getPile(pileUpdate.id);

  if (pile === null) {
    throw new Error(`updatePile: failed for id ${pileUpdate.id}`);
  }

  return pile;
}

async function updatePileAge(pileId: string): Promise<number> {
  const pile = await Pile.findOne({
    where: { id: pileId },
    relations: { palayBatches: true },
  });

  if (!pile || !pile.palayBatches || pile.palayBatches.length === 0) {
    return 0;
  }

  // Find the oldest dateBought among all PalayBatches
  const oldestDate = pile.palayBatches.reduce((oldest, batch) => {
    return batch.dateBought < oldest ? batch.dateBought : oldest;
  }, pile.palayBatches[0].dateBought);

  // Calculate months difference between oldest batch and current date
  const currentDate = new Date();
  const age = getMonthsDifference(oldestDate, currentDate);

  // Update pile age
  pile.age = age;
  await pile.save();

  // Update ages for all PalayBatches in this pile
  for (const batch of pile.palayBatches) {
    batch.age = age;
    await batch.save();
  }

  return age;
}
