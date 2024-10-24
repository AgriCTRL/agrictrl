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

    @Column({ nullable: true })
    plantedDate: Date;

    @Column({ nullable: true })
    harvestedDate: Date;

    @Column({ nullable: true })
    estimatedCapital: number;

    @Column()
    currentlyAt: string;

    @Column()
    status: string;
}

export type PalayBatchCreate = Pick<PalayBatch, 'palayVariety' | 'dateBought' | 'buyingStationName' | 'buyingStationLoc' | 'quantityBags' | 'grossWeight' | 'netWeight' | 'qualityType' | 'qualitySpecId' | 'price' | 'palaySupplierId' | 'farmId' | 'plantedDate' | 'harvestedDate' | 'estimatedCapital' | 'currentlyAt' | 'status'> &
{  qualitySpecId: QualitySpec['id'];
    palaySupplierId: PalaySupplier['id'];
    farmId: Farm['id'];
 };
export type PalayBatchUpdate = Pick<PalayBatch, 'id'> & Partial<PalayBatchCreate>;

function getCurrentPST(): Date {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 8));
}

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
    palayBatch.dateBought = getCurrentPST();
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
    palayBatch.currentlyAt = palayBatchCreate.currentlyAt;
    palayBatch.status = palayBatchCreate.status;

    return await palayBatch.save();
}

export async function updatePalayBatch(palayBatchUpdate: PalayBatchUpdate): Promise<PalayBatch> {
    await PalayBatch.update(palayBatchUpdate.id, {
        palayVariety: palayBatchUpdate.palayVariety,
        dateBought: palayBatchUpdate.dateBought,
        buyingStationName: palayBatchUpdate.buyingStationName,
        buyingStationLoc: palayBatchUpdate.buyingStationLoc,
        quantityBags: palayBatchUpdate.quantityBags,
        grossWeight: palayBatchUpdate.grossWeight,
        netWeight: palayBatchUpdate.netWeight,
        qualityType: palayBatchUpdate.qualityType,
        price: palayBatchUpdate.price,
        plantedDate: palayBatchUpdate.plantedDate,
        harvestedDate: palayBatchUpdate.harvestedDate,
        estimatedCapital: palayBatchUpdate.estimatedCapital,
        currentlyAt: palayBatchUpdate.currentlyAt,
        status: palayBatchUpdate.status
    });

    const palayBatch = await getPalayBatch(palayBatchUpdate.id);

    if (palayBatch === null) {
        throw new Error(`updatePalayBatch: failed for id ${palayBatchUpdate.id}`);
    }

    return palayBatch;
}
