import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

import { getQualitySpec, QualitySpec } from '../qualityspecs/db';

@Entity()
export class PalayBatch extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

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

    @Column()
    userId: number;

    @Column()
    status: string;
}

export type PalayBatchCreate = Pick<PalayBatch, 'dateBought' | 'quantityKg' | 'qualityType' | 'qualitySpecId' | 'price' | 'palaySupplierId' | 'userId' | 'status'> &
{ qualitySpecId: QualitySpec['id'] };
export type PalayBatchUpdate = Pick<PalayBatch, 'id'> & Partial<PalayBatchCreate>;

export async function getPalayBatches(limit: number, offset: number): Promise<PalayBatch[]> {
    return await PalayBatch.find({
        take: limit,
        skip: offset,
        relations: {
            qualitySpec: true
        }
    });
}

export async function getPalayBatch(id: number): Promise<PalayBatch | null> {
    return await PalayBatch.findOne({
        where: {
            id
        },
        relations: {
            qualitySpec: true
        }
    });
}

export async function countPalayBatches(): Promise<number> {
    return await PalayBatch.count();
}

export async function createPalayBatch(palayBatchCreate: PalayBatchCreate): Promise<PalayBatch> {
    let palayBatch = new PalayBatch();

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
    palayBatch.palaySupplierId = palayBatchCreate.palaySupplierId;
    palayBatch.userId = palayBatchCreate.userId;
    palayBatch.status = palayBatchCreate.status;

    return await palayBatch.save();
}

export async function updatePalayBatch(palayBatchUpdate: PalayBatchUpdate): Promise<PalayBatch> {
    await PalayBatch.update(palayBatchUpdate.id, {
        dateBought: palayBatchUpdate.dateBought,
        quantityKg: palayBatchUpdate.quantityKg,
        qualityType: palayBatchUpdate.qualityType,
        qualitySpecId: palayBatchUpdate.qualitySpecId,
        price: palayBatchUpdate.price,
        palaySupplierId: palayBatchUpdate.palaySupplierId,
        userId: palayBatchUpdate.userId,
        status: palayBatchUpdate.status
    });

    const palayBatch = await getPalayBatch(palayBatchUpdate.id);

    if (palayBatch === null) {
        throw new Error(`updatePalayBatch: failed for id ${palayBatchUpdate.id}`);
    }

    return palayBatch;
}
