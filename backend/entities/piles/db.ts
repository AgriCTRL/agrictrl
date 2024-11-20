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
}

export type PileCreate = Pick<
  Pile,
  "warehouseId" | "pileNumber" | "maxCapacity" | "currentQuantity" | "description" | "status"
>;

export type PileUpdate = Pick<Pile, "id"> & Partial<PileCreate>;

export async function getPiles(
  limit: number,
  offset: number
): Promise<{ data: Pile[]; total: number }> {
  const [data, total] = await Pile.findAndCount({
    take: limit,
    skip: offset,
    relations: {
      warehouse: true,
      palayBatches: true,
    },
  });

  return { data, total };
}

export async function getPile(id: string): Promise<Pile | null> {
  return await Pile.findOne({
    where: {
      id,
    },
    relations: {
      warehouse: true,
      palayBatches: true,
    },
  });
}

export async function getPilesByWarehouse(
  warehouseId: string,
  limit: number,
  offset: number
): Promise<{ data: Pile[]; total: number }> {
  const [data, total] = await Pile.findAndCount({
    where: {
      warehouseId,
    },
    take: limit,
    skip: offset,
    relations: {
      warehouse: true,
      palayBatches: true,
    },
  });

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

  return await pile.save();
}

export async function updatePile(pileUpdate: PileUpdate): Promise<Pile> {
  await Pile.update(pileUpdate.id, {
    maxCapacity: pileUpdate.maxCapacity,
    pileNumber: pileUpdate.pileNumber,
    currentQuantity: pileUpdate.currentQuantity,
    description: pileUpdate.description,
    status: pileUpdate.status,
  });

  const pile = await getPile(pileUpdate.id);

  if (pile === null) {
    throw new Error(`updatePile: failed for id ${pileUpdate.id}`);
  }

  return pile;
}
