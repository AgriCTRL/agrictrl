import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";
import { PalayBatch } from "../palaybatches/db";

@Entity()
export class UsedWSRWSI extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  number: number;

  @Column()
  type: "WSR" | "WSI";

  @Column()
  palayBatchId: string;

  @CreateDateColumn()
  createdAt: Date;
}

export async function recordUsedWSRWSI(
  number: number,
  type: "WSR" | "WSI",
  palayBatchId: string
): Promise<UsedWSRWSI> {
  // Check if the number is already recorded
  const existingRecord = await UsedWSRWSI.findOne({
    where: {
      number,
      type,
    },
  });

  if (existingRecord) {
    throw new Error(`${type} ${number} has already been used`);
  }

  const usedNumber = new UsedWSRWSI();
  usedNumber.number = number;
  usedNumber.type = type;
  usedNumber.palayBatchId = palayBatchId;
  return await usedNumber.save();
}

export async function checkExistingWSR(wsr: number): Promise<boolean> {
  // Check in current PalayBatch table
  const existingInCurrentBatches = await PalayBatch.findOne({
    where: { wsr },
  });

  // Check in UsedWSRWSI table
  const existingInUsedNumbers = await UsedWSRWSI.findOne({
    where: {
      number: wsr,
      type: "WSR",
    },
  });

  // Return true if found in either place
  return !!existingInCurrentBatches || !!existingInUsedNumbers;
}

export async function checkExistingWSI(wsi: number): Promise<boolean> {
  // Check in current PalayBatch table
  const existingInCurrentBatches = await PalayBatch.findOne({
    where: { wsi },
  });

  // Check in UsedWSRWSI table
  const existingInUsedNumbers = await UsedWSRWSI.findOne({
    where: {
      number: wsi,
      type: "WSI",
    },
  });

  // Return true if found in either place
  return !!existingInCurrentBatches || !!existingInUsedNumbers;
}
