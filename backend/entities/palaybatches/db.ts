import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

import { getQualitySpec, QualitySpec } from '../qualityspecs/db';
import { getPalayDelivery, PalayDelivery } from '../palaydeliveries/db';

@Entity()
export class PalayBatch extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    dateReceived: Date;

    @Column()
    quantity: number;

    @Column()
    qualityType: string;

    @Column()
    qualitySpecId: number;

    @ManyToOne(() => QualitySpec)
    qualitySpec: QualitySpec;

    @Column()
    price: number;

    @Column()
    supplierId: number;

    @Column()
    nfaPersonnelId: number;

    @Column()
    palayDeliveryId: number;

    @ManyToOne(() => PalayDelivery)
    palayDelivery: PalayDelivery;

    @Column()
    warehouseId: number;

    @Column()
    status: string;
}

export type PalayBatchCreate = Pick<PalayBatch, 'dateReceived' | 'quantity' | 'qualityType' | 'price' | 'supplierId' | 'nfaPersonnelId' | 'warehouseId' | 'status'> &
{ qualitySpecId: QualitySpec['id'], palayDeliveryId: PalayDelivery['id'] }
export type PalayBatchUpdate = Pick<PalayBatch, 'id'> & Partial<PalayBatchCreate>;

export async function getPalayBatches(limit: number, offset: number): Promise<PalayBatch[]> {
    return await PalayBatch.find({
        take: limit,
        skip: offset,
        relations: {
            qualitySpec: true,
            palayDelivery: true
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
            palayDelivery: true
        }
    });
}

export async function countPalayBatches(): Promise<number> {
    return await PalayBatch.count();
}

export async function createPalayBatch(palayBatchCreate: PalayBatchCreate): Promise<PalayBatch> {
    let palayBatch = new PalayBatch();

    palayBatch.dateReceived = palayBatchCreate.dateReceived;
    palayBatch.quantity = palayBatchCreate.quantity;
    palayBatch.qualityType = palayBatchCreate.qualityType;
    palayBatch.price = palayBatchCreate.price;
    palayBatch.supplierId = palayBatchCreate.supplierId;
    palayBatch.nfaPersonnelId = palayBatchCreate.nfaPersonnelId;
    palayBatch.warehouseId = palayBatchCreate.warehouseId;
    palayBatch.status = palayBatchCreate.status; 

    // qualitySpec

    const qualitySpec = await getQualitySpec(palayBatchCreate.qualitySpecId);

    if (qualitySpec === null) {
        throw new Error(``);
    }

    palayBatch.qualitySpecId = qualitySpec.id;
    palayBatch.qualitySpec = qualitySpec;

    // palayDelivery

    const palayDelivery = await getPalayDelivery(palayBatchCreate.palayDeliveryId);

    if (palayDelivery === null) {
        throw new Error(``);
    }

    palayBatch.palayDeliveryId = palayDelivery.id;
    palayBatch.palayDelivery = palayDelivery;

    return await palayBatch.save();
}

export async function updatePalayBatch(palayBatchUpdate: PalayBatchUpdate): Promise<PalayBatch> {
    console.log('palayBatchUpdate', palayBatchUpdate);

    await PalayBatch.update(palayBatchUpdate.id, {
        dateReceived: palayBatchUpdate.dateReceived,
        quantity: palayBatchUpdate.quantity,
        qualityType: palayBatchUpdate.qualityType,
        price: palayBatchUpdate.price,
        supplierId: palayBatchUpdate.supplierId,
        nfaPersonnelId: palayBatchUpdate.nfaPersonnelId,
        warehouseId: palayBatchUpdate.warehouseId,
        status: palayBatchUpdate.status  
    });

    const palayBatch = await getPalayBatch(palayBatchUpdate.id);

    if (palayBatch === null) {
        throw new Error(`updatePalayBatch: failed for id ${palayBatchUpdate.id}`);
    }

    return palayBatch;
}

export async function deletePalayBatch(id: number): Promise<number> {
    const deleteResult = await PalayBatch.delete(id);

    if (deleteResult.affected === 0) {
        throw new Error(`deletePalayBatch: could not delete palayBatch with id ${id}`);
    }

    return id;
}
