import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

import { getOfficeAddress, OfficeAddress } from '../officeaddresses/db';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: true })
    principal: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    gender: string;

    @Column()
    birthDate: Date;

    @Column()
    contactNumber: string;

    @Column()
    userType: string;

    @Column()
    organizationName: string;

    @Column()
    jobTitlePosition: string;

    @Column({ nullable: true })
    branchRegion: string;

    @Column({ nullable: true })
    branchOffice: string;

    @Column({ nullable: true })
    validId: string;

    @Column({ nullable: true })
    validIdName: string;

    @Column()
    officeAddressId: number;

    @ManyToOne(() => OfficeAddress)
    officeAddress: OfficeAddress;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 'Pending' })
    status: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ nullable: true })
    code: string;

    @Column()
    dateCreated: Date;
}

export type UserCreate = Pick<User, 'principal' | 'firstName' | 'lastName' | 'gender' | 'birthDate' | 'contactNumber' | 'userType' | 'organizationName' | 'jobTitlePosition' | 'branchRegion' | 'branchOffice' | 'validId' | 'validIdName' | 'officeAddressId' | 'email' | 'password' | 'status' | 'isVerified' | 'dateCreated' | 'code' > &
{ officeAddressId: OfficeAddress['id'] };
export type UserUpdate = Pick<User, 'id'> & Partial<UserCreate>;

function getCurrentPST(): Date {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 8));
}

export async function getUsers(limit: number, offset: number, userType?: string, status?: string): Promise<User[]> {
    let whereClause: any = {};
    
    if (userType) {
        whereClause.userType = userType;
    }

    if (status) {
        whereClause.status = status;
    }

    return await User.find({
        where: whereClause,
        take: limit,
        skip: offset,
        relations: {
            officeAddress: true
        }
    });
}

export async function getUser(id: number): Promise<User | null> {
    return await User.findOne({
        where: {
            id
        },
        relations: {
            officeAddress: true
        }
    });
}

export async function countUsers(): Promise<number> {
    return await User.count();
}

export async function createUser(userCreate: UserCreate): Promise<User> {
    let user = new User();

    user.principal = userCreate.principal;
    user.firstName = userCreate.firstName;
    user.lastName = userCreate.lastName;
    user.gender = userCreate.gender;
    user.birthDate = userCreate.birthDate;
    user.contactNumber = userCreate.contactNumber;
    user.userType = userCreate.userType;
    user.organizationName = userCreate.organizationName;
    user.jobTitlePosition = userCreate.jobTitlePosition;
    user.branchRegion = userCreate.branchRegion;
    user.branchOffice = userCreate.branchOffice;
    user.validId = userCreate.validId;
    user.validIdName = userCreate.validIdName;

    // officeAddress

    const officeAddress = await getOfficeAddress(userCreate.officeAddressId);

    if (officeAddress === null) {
        throw new Error(``);
    }

    user.officeAddressId = officeAddress.id;

    user.email = userCreate.email;
    user.password = userCreate.password;
    user.status = userCreate.status;
    user.isVerified = userCreate.isVerified;
    user.dateCreated = getCurrentPST();

    return await user.save();
}

export async function updateUser(userUpdate: UserUpdate): Promise<User> {
    await User.update(userUpdate.id, {
        principal: userUpdate.principal,
        firstName: userUpdate.firstName,
        lastName: userUpdate.lastName,
        gender: userUpdate.gender,
        birthDate: userUpdate.birthDate,
        contactNumber: userUpdate.contactNumber,
        userType: userUpdate.userType,
        organizationName: userUpdate.organizationName,
        jobTitlePosition: userUpdate.jobTitlePosition,
        branchRegion: userUpdate.branchRegion,
        branchOffice: userUpdate.branchOffice,
        validId: userUpdate.validId,
        validIdName: userUpdate.validIdName,
        email: userUpdate.email,
        password: userUpdate.password,
        status: userUpdate.status,
        isVerified: userUpdate.isVerified,
        code: userUpdate.code
    });

    const user = await getUser(userUpdate.id);

    if (user === null) {
        throw new Error(`updateUser: failed for id ${userUpdate.id}`);
    }

    return user;
}
