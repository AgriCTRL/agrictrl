import express, { Request, Response, Router } from 'express';

import { createOfficeAddress } from '../officeaddresses/db';
import {
    countUsers,
    createUser,
    getUser,
    getUsers,
    updateUser
} from './db';
import { User } from './db';

export function getRouter(): Router {
    const router = express.Router();

    router.get(
        '/',
        async (
            req: Request<any, any, any, { limit?: string; offset?: string; userType?: string; status?: string }>,
            res
        ) => {
            const limit = Number(req.query.limit ?? -1);
            const offset = Number(req.query.offset ?? 0);
            const userType = req.query.userType;
            const status = req.query.status;

            const users = await getUsers(limit, offset, userType, status);

            res.json(users);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countUsers());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const user = await getUser(Number(id));

        res.json(user);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { principal: string;
                firstName: string;
                lastName: string;
                gender: string;
                birthDate: Date;
                contactNumber: string;
                userType: string
                organizationName: string;
                jobTitlePosition: string;
                branchRegion: string;
                branchOffice: string;
                validId: string;
                validIdName: string;
                region: string;
                province: string;
                cityTown: string;
                barangay: string;
                street: string;
                email: string;
                password: string;
                status: string;
                isVerified: boolean;
                dateCreated: Date;
                code: string }>,
            res
        ) => {
            const { principal,
                firstName,
                lastName,
                gender,
                birthDate,
                contactNumber,
                userType,
                organizationName,
                jobTitlePosition,
                branchRegion,
                branchOffice,
                validId,
                validIdName,
                region,
                province,
                cityTown,
                barangay,
                street,
                email,
                password,
                status,
                isVerified,
                dateCreated,
                code } = req.body;

            const officeAddress = await createOfficeAddress({
                region: region,
                province: province,
                cityTown: cityTown,
                barangay: barangay,
                street: street
            });

            const user = await createUser({
                principal,
                firstName,
                lastName,
                gender,
                birthDate,
                contactNumber,
                userType,
                organizationName,
                jobTitlePosition,
                branchRegion,
                branchOffice,
                validId,
                validIdName,
                officeAddressId: officeAddress.id,
                email,
                password,
                status,
                isVerified,
                dateCreated,
                code
            });

            res.json(user);
        }
    );

    router.post('/update', updateHandler);

    router.post('/login', async (req, res) => {
        const { email, password, userType } = req.body;

        try {
            const user = await User.findOne({ 
            where: { email, password, userType, isVerified: true } 
            });

            if (user) {
            res.json(user);
            } else {
            res.status(404).json({ message: 'Invalid credentials' });
            }
        } catch (error) {
            res.status(500).json({ message: 'An error occurred during login' });
        }
    });

    router.post('/forgotpassword', async (req, res) => {
        const { email } = req.body;

        try {
            const user = await User.findOne({
                where: { email }
            });

            if (user) {
                res.json(user.id);
            } else {
                res.status(404).json({ message: 'Email not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'An error has occured' });
        }
    })

    router.post('/verifycode', async (req, res) => {
        const { email, code } = req.body;

        try {
            const user = await User.findOne({
                where: { email, code }
            });

            if (user) {
                res.json(user.id);
            } else {
                res.status(404).json({ message: 'Code does not match' });
            }
        } catch (error) {
            res.status(500).json({ message: 'An error has occured' });
        }
    })

    return router;
}

async function updateHandler(
    req: Request<any, any, { id: number;
        principal?: string;
        firstName?: string;
        lastName?: string;
        gender?: string;
        birthDate?: Date;
        contactNumber?: string;
        userType?: string;
        organizationName?: string;
        jobTitlePosition?: string;
        branchRegion?: string;
        branchOffice?: string;
        validId?: string;
        validIdName?: string;
        email?: string;
        password?: string;
        status?: string;
        isVerified?: boolean;
        dateCreated?: Date;
        code?: string }>,
    res: Response
): Promise<void> {
    const { id,
        principal,
        firstName,
        lastName,
        gender,
        birthDate,
        contactNumber,
        userType,
        organizationName,
        jobTitlePosition,
        branchRegion,
        branchOffice,
        validId,
        validIdName,
        email,
        password,
        status,
        isVerified,
        dateCreated,
        code } = req.body;

    const user = await updateUser({
        id,
        principal,
        firstName,
        lastName,
        gender,
        birthDate,
        contactNumber,
        userType,
        organizationName,
        jobTitlePosition,
        branchRegion,
        branchOffice,
        validId,
        validIdName,
        email,
        password,
        status,
        isVerified,
        dateCreated,
        code
    });

    res.json(user);
}
