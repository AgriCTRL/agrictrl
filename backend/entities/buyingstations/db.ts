import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BuyingStation extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    buyingStationName: string;

    @Column()
    location: string;
}

export type BuyingStationCreate = Pick<BuyingStation, 'buyingStationName' | 'location' >;
export type BuyingStationUpdate = Pick<BuyingStation, 'id'> & Partial<BuyingStationCreate>;

export async function getBuyingStations(limit: number, offset: number): Promise<BuyingStation[]> {
    return await BuyingStation.find({
        take: limit,
        skip: offset
    });
}

export async function getBuyingStation(id: number): Promise<BuyingStation | null> {
    return await BuyingStation.findOne({
        where: {
            id
        }
    });
}

export async function countBuyingStations(): Promise<number> {
    return await BuyingStation.count();
}

export async function createBuyingStation(buyingStationCreate: BuyingStationCreate): Promise<BuyingStation> {
    let buyingStation = new BuyingStation();

    buyingStation.buyingStationName = buyingStationCreate.buyingStationName;
    buyingStation.location = buyingStationCreate.location;

    return await buyingStation.save();
}

export async function updateBuyingStation(buyingStationUpdate: BuyingStationUpdate): Promise<BuyingStation> {
    await BuyingStation.update(buyingStationUpdate.id, {
        buyingStationName: buyingStationUpdate.buyingStationName,
        location: buyingStationUpdate.location
    });

    const buyingStation = await getBuyingStation(buyingStationUpdate.id);

    if (buyingStation === null) {
        throw new Error(`updateBuyingStation: failed for id ${buyingStationUpdate.id}`);
    }

    return buyingStation;
}
