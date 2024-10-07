import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class QualitySpec extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    moistureContent: number;

    @Column()
    purity: number;

    @Column()
    damaged: number;
}

export type QualitySpecCreate = Pick<QualitySpec, 'moistureContent' | 'purity' | 'damaged'>;
export type QualitySpecUpdate = Pick<QualitySpec, 'id'> & Partial<QualitySpecCreate>;

export async function getQualitySpecs(limit: number, offset: number): Promise<QualitySpec[]> {
    return await QualitySpec.find({
        take: limit,
        skip: offset
    });
}

export async function getQualitySpec(id: number): Promise<QualitySpec | null> {
    return await QualitySpec.findOne({
        where: {
            id
        }
    });
}

export async function countQualitySpecs(): Promise<number> {
    return await QualitySpec.count();
}

export async function createQualitySpec(qualitySpecCreate: QualitySpecCreate): Promise<QualitySpec> {
    let qualitySpec = new QualitySpec();

    qualitySpec.moistureContent = qualitySpecCreate.moistureContent;
    qualitySpec.purity = qualitySpecCreate.purity;
    qualitySpec.damaged = qualitySpecCreate.damaged;

    return await qualitySpec.save();
}

export async function updateQualitySpec(qualitySpecUpdate: QualitySpecUpdate): Promise<QualitySpec> {
    await QualitySpec.update(qualitySpecUpdate.id, {
        moistureContent: qualitySpecUpdate.moistureContent,
        purity: qualitySpecUpdate.purity,
        damaged: qualitySpecUpdate.damaged,
    });

    const qualitySpec = await getQualitySpec(qualitySpecUpdate.id);

    if (qualitySpec === null) {
        throw new Error(`updateQualitySpec: failed for id ${qualitySpecUpdate.id}`);
    }

    return qualitySpec;
}
