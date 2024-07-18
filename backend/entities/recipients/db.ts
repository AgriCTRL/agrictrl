import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Recipient extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    contactNo: number;

    @Column()
    email: string;
}

export type RecipientCreate = Pick<Recipient, 'name' | 'type' | 'contactNo' | 'email'>;
export type RecipientUpdate = Pick<Recipient, 'id'> & Partial<RecipientCreate>;

export async function getRecipients(limit: number, offset: number): Promise<Recipient[]> {
    return await Recipient.find({
        take: limit,
        skip: offset
    });
}

export async function getRecipient(id: number): Promise<Recipient | null> {
    return await Recipient.findOne({
        where: {
            id
        }
    });
}

export async function countRecipients(): Promise<number> {
    return await Recipient.count();
}

export async function createRecipient(recipientCreate: RecipientCreate): Promise<Recipient> {
    let recipient = new Recipient();

    recipient.name = recipientCreate.name;
    recipient.type = recipientCreate.type;
    recipient.contactNo = recipientCreate.contactNo;
    recipient.email = recipientCreate.email;

    return await recipient.save();
}

export async function updateRecipient(recipientUpdate: RecipientUpdate): Promise<Recipient> {
    await Recipient.update(recipientUpdate.id, {
        name: recipientUpdate.name,
        type: recipientUpdate.type,
        contactNo: recipientUpdate.contactNo,
        email: recipientUpdate.email,
    });

    const recipient = await getRecipient(recipientUpdate.id);

    if (recipient === null) {
        throw new Error(`updateRecipient: failed for id ${recipientUpdate.id}`);
    }

    return recipient;
}

export async function deleteRecipient(id: number): Promise<number> {
    const deleteResult = await Recipient.delete(id);

    if (deleteResult.affected === 0) {
        throw new Error(`deleteRecipient: could not delete recipient with id ${id}`);
    }

    return id;
}
