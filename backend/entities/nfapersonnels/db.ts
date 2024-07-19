import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NfaPersonnel extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    position: string;

    @Column()
    region: string;
}

export type NfaPersonnelCreate = Pick<NfaPersonnel, 'name' | 'position' | 'region'>;
export type NfaPersonnelUpdate = Pick<NfaPersonnel, 'id'> & Partial<NfaPersonnelCreate>;

export async function getNfaPersonnels(limit: number, offset: number): Promise<NfaPersonnel[]> {
    return await NfaPersonnel.find({
        take: limit,
        skip: offset
    });
}

export async function getNfaPersonnel(id: number): Promise<NfaPersonnel | null> {
    return await NfaPersonnel.findOne({
        where: {
            id
        }
    });
}

export async function countNfaPersonnels(): Promise<number> {
    return await NfaPersonnel.count();
}

export async function createNfaPersonnel(nfaPersonnelCreate: NfaPersonnelCreate): Promise<NfaPersonnel> {
    let nfaPersonnel = new NfaPersonnel();

    nfaPersonnel.name = nfaPersonnelCreate.name;
    nfaPersonnel.position = nfaPersonnelCreate.position;
    nfaPersonnel.region = nfaPersonnelCreate.region;

    return await nfaPersonnel.save();
}

export async function updateNfaPersonnel(nfaPersonnelUpdate: NfaPersonnelUpdate): Promise<NfaPersonnel> {
    await NfaPersonnel.update(nfaPersonnelUpdate.id, {
        name: nfaPersonnelUpdate.name,
        position: nfaPersonnelUpdate.position,
        region: nfaPersonnelUpdate.region
    });

    const nfaPersonnel = await getNfaPersonnel(nfaPersonnelUpdate.id);

    if (nfaPersonnel === null) {
        throw new Error(`updateNfaPersonnel: failed for id ${nfaPersonnelUpdate.id}`);
    }

    return nfaPersonnel;
}

export async function deleteNfaPersonnel(id: number): Promise<number> {
    const deleteResult = await NfaPersonnel.delete(id);

    if (deleteResult.affected === 0) {
        throw new Error(`deleteNfaPersonnel: could not delete nfaPersonnel with id ${id}`);
    }

    return id;
}
