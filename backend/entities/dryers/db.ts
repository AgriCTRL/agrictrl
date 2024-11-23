import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  BeforeInsert,
} from "typeorm";

@Entity()
export class Dryer extends BaseEntity {
  @PrimaryColumn("varchar", { length: 10 })
  id: string;

  @Column()
  dryerName: string;

  @Column()
  type: string;

  @Column()
  userId: string;

  @Column()
  location: string;

  @Column()
  capacity: number;

  @Column()
  processing: number;

  @Column()
  contactNumber: string;

  @Column()
  email: string;

  @Column()
  status: string;

  @BeforeInsert()
  async generateId() {
    const prefix = "030421";
    const lastOrder = await Dryer.find({
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

export type DryerCreate = Pick<
  Dryer,
  | "dryerName"
  | "userId"
  | "type"
  | "location"
  | "capacity"
  | "processing"
  | "contactNumber"
  | "email"
  | "status"
>;
export type DryerUpdate = Pick<Dryer, "id"> & Partial<DryerCreate>;

export async function getDryers(
  limit: number,
  offset: number
): Promise<Dryer[]> {
  return await Dryer.find({
    take: limit,
    skip: offset,
  });
}

export async function getDryer(id: string): Promise<Dryer | null> {
  return await Dryer.findOne({
    where: {
      id,
    },
  });
}

export async function countDryers(): Promise<number> {
  return await Dryer.count();
}

export async function createDryer(dryerCreate: DryerCreate): Promise<Dryer> {
  let dryer = new Dryer();

  dryer.dryerName = dryerCreate.dryerName;
  dryer.userId = dryerCreate.userId;
  dryer.type = dryerCreate.type;
  dryer.location = dryerCreate.location;
  dryer.capacity = dryerCreate.capacity;
  dryer.processing = dryerCreate.processing;
  dryer.contactNumber = dryerCreate.contactNumber;
  dryer.email = dryerCreate.email;
  dryer.status = dryerCreate.status;

  return await dryer.save();
}

export async function updateDryer(dryerUpdate: DryerUpdate): Promise<Dryer> {
  await Dryer.update(dryerUpdate.id, {
    dryerName: dryerUpdate.dryerName,
    userId: dryerUpdate.userId,
    type: dryerUpdate.type,
    location: dryerUpdate.location,
    capacity: dryerUpdate.capacity,
    processing: dryerUpdate.processing,
    contactNumber: dryerUpdate.contactNumber,
    email: dryerUpdate.email,
    status: dryerUpdate.status,
  });

  const dryer = await getDryer(dryerUpdate.id);

  if (dryer === null) {
    throw new Error(`updateDryer: failed for id ${dryerUpdate.id}`);
  }

  return dryer;
}
