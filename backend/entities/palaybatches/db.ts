import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

import { getQualitySpec, QualitySpec } from '../qualityspecs/db';
import { getDeliveryDetail, DeliveryDetail } from '../deliverydetails/db';

@Entity()
export class PalayBatch extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    dateReceived: Date;

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
    supplierId: number;

    @Column()
    nfaPersonnelId: number;

    @Column()
    deliveryDetailId: number;

    @ManyToOne(() => DeliveryDetail)
    deliveryDetail: DeliveryDetail;

    @Column()
    warehouseId: number;

    @Column()
    status: string;
}

export type PalayBatchCreate = Pick<PalayBatch, 'dateReceived' | 'quantityKg' | 'qualityType' | 'price' | 'supplierId' | 'nfaPersonnelId' | 'warehouseId' | 'status'> &
{ qualitySpecId: QualitySpec['id'], deliveryDetailId: DeliveryDetail['id'] }
export type PalayBatchUpdate = Pick<PalayBatch, 'id'> & Partial<PalayBatchCreate>;

export async function getPalayBatches(limit: number, offset: number): Promise<PalayBatch[]> {
    return await PalayBatch.find({
        take: limit,
        skip: offset,
        relations: {
            qualitySpec: true,
            deliveryDetail: true
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
            deliveryDetail: true
        }
    });
}

export async function countPalayBatches(): Promise<number> {
    return await PalayBatch.count();
}

export async function createPalayBatch(palayBatchCreate: PalayBatchCreate): Promise<PalayBatch> {
    let palayBatch = new PalayBatch();

    palayBatch.dateReceived = palayBatchCreate.dateReceived;
    palayBatch.quantityKg = palayBatchCreate.quantityKg;
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

    // deliveryDetail

    const deliveryDetail = await getDeliveryDetail(palayBatchCreate.deliveryDetailId);

    if (deliveryDetail === null) {
        throw new Error(``);
    }

    palayBatch.deliveryDetailId = deliveryDetail.id;
    palayBatch.deliveryDetail = deliveryDetail;

    return await palayBatch.save();
}

export async function updatePalayBatch(palayBatchUpdate: PalayBatchUpdate): Promise<PalayBatch> {
    console.log('palayBatchUpdate', palayBatchUpdate);

    await PalayBatch.update(palayBatchUpdate.id, {
        dateReceived: palayBatchUpdate.dateReceived,
        quantityKg: palayBatchUpdate.quantityKg,
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
