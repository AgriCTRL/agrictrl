import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  BeforeInsert,
} from "typeorm";

import { getQualitySpec, QualitySpec } from "../qualityspecs/db";
import { getPalaySupplier, PalaySupplier } from "../palaysuppliers/db";
import { getFarm, Farm } from "../farms/db";
import { Transaction } from "../transactions/db";
import { Pile } from "../piles/db";

@Entity()
export class PalayBatch extends BaseEntity {
  @PrimaryColumn("varchar", { length: 10 })
  id: string;

  @Column()
  dateBought: Date;

  @Column()
  wsr: number;

  @Column()
  wsi: number;

  @Column()
  age: number;

  @Column()
  buyingStationName: string;

  @Column()
  buyingStationLoc: string;

  @Column()
  quantityBags: number;

  @Column()
  grossWeight: number;

  @Column()
  netWeight: number;

  @Column()
  qualityType: string;

  @Column()
  qualitySpecId: string;

  @ManyToOne(() => QualitySpec)
  qualitySpec: QualitySpec;

  @Column()
  varietyCode: string;

  @Column()
  price: number;

  @Column()
  palaySupplierId: string;

  @ManyToOne(() => PalaySupplier)
  palaySupplier: PalaySupplier;

  @Column()
  farmId: string;

  @ManyToOne(() => Farm)
  farm: Farm;

  @Column({ nullable: true })
  plantedDate: Date;

  @Column({ nullable: true })
  harvestedDate: Date;

  @Column({ nullable: true })
  estimatedCapital: number;

  @Column()
  currentlyAt: string;

  @Column()
  weighedBy: string;

  @Column()
  correctedBy: string;

  @Column()
  classifiedBy: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  pileId: string;

  @ManyToOne(() => Pile)
  pile: Pile;

  @OneToMany(() => Transaction, (transaction) => transaction.palayBatch)
  transactions: Transaction[];

  @BeforeInsert()
  async generateId() {
    const prefix = "030401";
    const lastOrder = await PalayBatch.find({
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

export type PalayBatchCreate = Pick<
  PalayBatch,
  | "wsr"
  | "wsi"
  | "dateBought"
  | "age"
  | "buyingStationName"
  | "buyingStationLoc"
  | "quantityBags"
  | "grossWeight"
  | "netWeight"
  | "qualityType"
  | "qualitySpecId"
  | "varietyCode"
  | "price"
  | "palaySupplierId"
  | "farmId"
  | "plantedDate"
  | "harvestedDate"
  | "estimatedCapital"
  | "currentlyAt"
  | "weighedBy"
  | "correctedBy"
  | "classifiedBy"
  | "status"
  | "pileId"
> & {
  qualitySpecId: QualitySpec["id"];
  palaySupplierId: PalaySupplier["id"];
  farmId: Farm["id"];
};
export type PalayBatchUpdate = Pick<PalayBatch, "id"> &
  Partial<PalayBatchCreate>;

function getCurrentPST(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 8);
}

export async function getPalayBatches(
  limit: number,
  offset: number
): Promise<{ data: PalayBatch[]; total: number }> {
  const [data, total] = await PalayBatch.findAndCount({
    take: limit,
    skip: offset,
    relations: {
      qualitySpec: true,
      palaySupplier: true,
      farm: true,
    },
  });

  return { data, total };
}

export async function getPalayBatch(id: string): Promise<PalayBatch | null> {
  return await PalayBatch.findOne({
    where: {
      id,
    },
    relations: {
      qualitySpec: true,
      palaySupplier: true,
      farm: true,
    },
  });
}

export async function countPalayBatches(): Promise<number> {
  return await PalayBatch.count();
}

export async function createPalayBatch(
  palayBatchCreate: PalayBatchCreate
): Promise<PalayBatch> {
  let palayBatch = new PalayBatch();

  palayBatch.dateBought = getCurrentPST();
  palayBatch.wsr = palayBatchCreate.wsr;
  palayBatch.wsi = palayBatchCreate.wsi;
  palayBatch.age = palayBatchCreate.age;
  palayBatch.buyingStationName = palayBatchCreate.buyingStationName;
  palayBatch.buyingStationLoc = palayBatchCreate.buyingStationLoc;
  palayBatch.quantityBags = palayBatchCreate.quantityBags;
  palayBatch.grossWeight = palayBatchCreate.grossWeight;
  palayBatch.netWeight = palayBatchCreate.netWeight;
  palayBatch.qualityType = palayBatchCreate.qualityType;

  // qualitySpec

  const qualitySpec = await getQualitySpec(palayBatchCreate.qualitySpecId);

  if (qualitySpec === null) {
    throw new Error(``);
  }

  palayBatch.qualitySpecId = qualitySpec.id;

  palayBatch.varietyCode = palayBatchCreate.varietyCode;

  palayBatch.price = palayBatchCreate.price;

  // palaySupplier

  const palaySupplier = await getPalaySupplier(
    palayBatchCreate.palaySupplierId
  );

  if (palaySupplier === null) {
    throw new Error(``);
  }

  palayBatch.palaySupplierId = palaySupplier.id;

  // farm

  const farm = await getFarm(palayBatchCreate.farmId);

  if (farm === null) {
    throw new Error(``);
  }

  palayBatch.farmId = farm.id;

  palayBatch.plantedDate = palayBatchCreate.plantedDate;
  palayBatch.harvestedDate = palayBatchCreate.harvestedDate;
  palayBatch.estimatedCapital = palayBatchCreate.estimatedCapital;
  palayBatch.currentlyAt = palayBatchCreate.currentlyAt;
  palayBatch.weighedBy = palayBatchCreate.weighedBy;
  palayBatch.correctedBy = palayBatchCreate.correctedBy;
  palayBatch.classifiedBy = palayBatchCreate.classifiedBy;
  palayBatch.status = palayBatchCreate.status;
  palayBatch.pileId = palayBatchCreate.pileId;

  return await palayBatch.save();
}

export async function updatePalayBatch(
  palayBatchUpdate: PalayBatchUpdate
): Promise<PalayBatch> {
  await PalayBatch.update(palayBatchUpdate.id, {
    dateBought: palayBatchUpdate.dateBought,
    wsr: palayBatchUpdate.wsr,
    wsi: palayBatchUpdate.wsi,
    age: palayBatchUpdate.age,
    buyingStationName: palayBatchUpdate.buyingStationName,
    buyingStationLoc: palayBatchUpdate.buyingStationLoc,
    quantityBags: palayBatchUpdate.quantityBags,
    grossWeight: palayBatchUpdate.grossWeight,
    netWeight: palayBatchUpdate.netWeight,
    qualityType: palayBatchUpdate.qualityType,
    varietyCode: palayBatchUpdate.varietyCode,
    price: palayBatchUpdate.price,
    plantedDate: palayBatchUpdate.plantedDate,
    harvestedDate: palayBatchUpdate.harvestedDate,
    estimatedCapital: palayBatchUpdate.estimatedCapital,
    currentlyAt: palayBatchUpdate.currentlyAt,
    weighedBy: palayBatchUpdate.weighedBy,
    correctedBy: palayBatchUpdate.correctedBy,
    classifiedBy: palayBatchUpdate.classifiedBy,
    status: palayBatchUpdate.status,
    pileId: palayBatchUpdate.pileId,
  });

  const palayBatch = await getPalayBatch(palayBatchUpdate.id);

  if (palayBatch === null) {
    throw new Error(`updatePalayBatch: failed for id ${palayBatchUpdate.id}`);
  }

  return palayBatch;
}

export async function getTotalQuantityBags(): Promise<number> {
  const result = await PalayBatch.createQueryBuilder("palayBatch")
    .select("SUM(palayBatch.quantityBags)", "total")
    .getRawOne();

  return result?.total || 0;
}

export async function getTotalPalayQuantityBags(): Promise<number> {
  const result = await PalayBatch.createQueryBuilder("palayBatch")
    .select("SUM(palayBatch.quantityBags)", "total")
    .where("LOWER(palayBatch.currentlyAt) LIKE LOWER(:term)", {
      term: "%palay%",
    })
    .getRawOne();

  return result?.total || 0;
}

export async function searchPalayBatches(
  searchParams: {
    id?: string;
    // buyingStationName?: string;
    // status?: string;
  },
  limit: number,
  offset: number
): Promise<{ data: PalayBatch[]; total: number }> {
  const queryBuilder = PalayBatch.createQueryBuilder("palayBatch")
    .leftJoinAndSelect("palayBatch.qualitySpec", "qualitySpec")
    .leftJoinAndSelect("palayBatch.palaySupplier", "palaySupplier")
    .leftJoinAndSelect("palayBatch.farm", "farm");

  if (searchParams.id) {
    queryBuilder.andWhere("palayBatch.id LIKE :id", {
      id: `%${searchParams.id}%`,
    });
  }
  // Add other search conditions as needed
  // if (searchParams.buyingStationName) {
  //   queryBuilder.andWhere("palayBatch.buyingStationName LIKE :name", { name: `%${searchParams.buyingStationName}%` });
  // }

  const total = await queryBuilder.getCount();

  const data = await queryBuilder.take(limit).skip(offset).getMany();

  return { data, total };
}
