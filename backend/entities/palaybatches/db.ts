import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

import { getQualitySpec, QualitySpec } from '../qualityspecs/db';
import { getPalaySupplier, PalaySupplier } from '../palaysuppliers/db';
import { getFarm, Farm } from '../farms/db';

@Entity()
export class PalayBatch extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    palayVariety: string;

    @Column()
    dateBought: Date;

    @Column()
    quantityKg: number;
    
    @Column()
    qualityType: string;

    @Column()
    qualitySpecId: number;

    @ManyToOne(() => QualitySpec)
    qualitySpec: QualitySpec;

    @Column()
    price: number;

    @Column()
    palaySupplierId: number;

    @ManyToOne(() => PalaySupplier)
    palaySupplier: PalaySupplier;

    @Column()
    farmId: number;

    @ManyToOne(() => Farm)
    farm: Farm;

    @Column()
    plantedDate: Date;

    @Column()
    harvestedDate: Date;

    @Column()
    estimatedCapital: number;

    @Column()
    userId: number;

    @Column()
    status: string;
}

export type PalayBatchCreate = Pick<PalayBatch, 'palayVariety' | 'dateBought' | 'quantityKg' | 'qualityType' | 'qualitySpecId' | 'price' | 'palaySupplierId' | 'farmId' | 'plantedDate' | 'harvestedDate' | 'estimatedCapital' | 'userId' | 'status'> &
{ qualitySpecId: QualitySpec['id'] };
export type PalayBatchUpdate = Pick<PalayBatch, 'id'> & Partial<PalayBatchCreate>;

export async function getPalayBatches(limit: number, offset: number): Promise<PalayBatch[]> {
    return await PalayBatch.find({
        take: limit,
        skip: offset,
        relations: {
            qualitySpec: true,
            palaySupplier: true,
            farm: true
        }
    });
}

export async function getPalayBatch(id: number): Promise<PalayBatch | null> {
    return await PalayBatch.findOne({
        where: {
            id
        },
        relations: {
            qualitySpec: true,
            palaySupplier: true,
            farm: true
        }
    });
}

export async function countPalayBatches(): Promise<number> {
    return await PalayBatch.count();
}

export async function createPalayBatch(palayBatchCreate: PalayBatchCreate): Promise<PalayBatch> {
    let palayBatch = new PalayBatch();

    palayBatch.palayVariety = palayBatchCreate.palayVariety;
    palayBatch.dateBought = palayBatchCreate.dateBought;
    palayBatch.quantityKg = palayBatchCreate.quantityKg;
    palayBatch.qualityType = palayBatchCreate.qualityType;

    // qualitySpec

    const qualitySpec = await getQualitySpec(palayBatchCreate.qualitySpecId);

    if (qualitySpec === null) {
        throw new Error(``);
    }

    palayBatch.qualitySpecId = qualitySpec.id;

    palayBatch.price = palayBatchCreate.price;

    // palaySupplier

    const palaySupplier = await getPalaySupplier(palayBatchCreate.palaySupplierId);

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
    palayBatch.userId = palayBatchCreate.userId;
    palayBatch.status = palayBatchCreate.status;

    return await palayBatch.save();
}

export async function updatePalayBatch(palayBatchUpdate: PalayBatchUpdate): Promise<PalayBatch> {
    await PalayBatch.update(palayBatchUpdate.id, {
        palayVariety: palayBatchUpdate.palayVariety,
        dateBought: palayBatchUpdate.dateBought,
        quantityKg: palayBatchUpdate.quantityKg,
        qualityType: palayBatchUpdate.qualityType,
        price: palayBatchUpdate.price,
        plantedDate: palayBatchUpdate.plantedDate,
        harvestedDate: palayBatchUpdate.harvestedDate,
        estimatedCapital: palayBatchUpdate.estimatedCapital,
        userId: palayBatchUpdate.userId,
        status: palayBatchUpdate.status
    });

    const palayBatch = await getPalayBatch(palayBatchUpdate.id);

    if (palayBatch === null) {
        throw new Error(`updatePalayBatch: failed for id ${palayBatchUpdate.id}`);
    }

    return palayBatch;
}
