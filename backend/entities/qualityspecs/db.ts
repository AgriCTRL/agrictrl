import { BaseEntity, Column, Entity, PrimaryColumn, BeforeInsert } from 'typeorm';

@Entity()
export class QualitySpec extends BaseEntity {
    @PrimaryColumn('varchar', { length: 10 })
    id: string;

    @Column()
    moistureContent: number;

    @Column()
    purity: number;

    @Column()
    damaged: number;

    @BeforeInsert()
    async generateId() {
        const prefix = '030411';
        const lastOrder = await QualitySpec.find({
            order: { id: 'DESC' },
            take: 1
        });

        let nextNumber = 1;
        if (lastOrder.length > 0) {
            const lastId = lastOrder[0].id;
            const lastNumber = parseInt(lastId.slice(-4));
            nextNumber = lastNumber + 1;
        }

        this.id = `${prefix}${nextNumber.toString().padStart(4, '0')}`;
    }
}

export type QualitySpecCreate = Pick<QualitySpec, 'moistureContent' | 'purity' | 'damaged'>;
export type QualitySpecUpdate = Pick<QualitySpec, 'id'> & Partial<QualitySpecCreate>;

export async function getQualitySpecs(limit: number, offset: number): Promise<QualitySpec[]> {
    return await QualitySpec.find({
        take: limit,
        skip: offset
    });
}

export async function getQualitySpec(id: string): Promise<QualitySpec | null> {
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
