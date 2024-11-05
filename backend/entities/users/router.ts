import express, { Request, Response, Router } from 'express';
import CryptoJS from 'crypto-js';

import { createOfficeAddress } from '../officeaddresses/db';
import {
    countUsers,
    countRecipientUsers,
    createUser,
    getUser,
    getUsers,
    updateUser
} from './db';
import { User } from './db';

const encryptionKey = 'pupladderized';

function encryptData(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString();
}

function decryptData(cipherText: string): string {
    const bytes = CryptoJS.AES.decrypt(cipherText, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

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
            // const encryptedData = encryptData(users);
            // res.json({ data: encryptedData });
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countUsers());
    });

    router.get('/recipients/count', async (_req, res) => {
        res.json(await countRecipientUsers());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const user = await getUser(String(id));

        res.json(user);
    });

    router.post('/', async (req, res) => {
            const { encryptedPayload } = req.body;

            try {
                const decryptedPayload = decryptData(encryptedPayload);
                const {
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
                    code
                } = JSON.parse(decryptedPayload);
    
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
    
                res.json(null);
            } catch (error) {
                console.error('Error decrypting or registering user:', error);
                res.status(500).json({ message: 'Failed to register user' });
            }
        }
    );

    router.post('/update', async (req, res) => {
        const { encryptedPayload } = req.body;

        try {
            const decryptedPayload = decryptData(encryptedPayload);
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
                code } = JSON.parse(decryptedPayload);
        
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

            res.json(null);
        } catch (error) {
            console.error('Error decrypting or updating user:', error);
            res.status(500).json({ message: 'Failed to register user' });
        }
    });

    router.post('/login', async (req, res) => {
        const { encryptedPayload } = req.body;

        try {
            const decryptedPayload = decryptData(encryptedPayload);
            const { email, password, userType } = JSON.parse(decryptedPayload);
            const user = await User.findOne({ 
            where: { email, password, userType, isVerified: true } 
            });

            if (user) {
                const encryptedData = encryptData(user);
                res.json({ data: encryptedData });
            } else {
                res.status(404).json({ message: 'Invalid credentials' });
            }
        } catch (error) {
            res.status(500).json({ message: 'An error occurred during login' });
        }
    });

    router.post('/forgotpassword', async (req, res) => {
        const { encryptedPayload } = req.body;

        try {
            const decryptedPayload = decryptData(encryptedPayload);
            const { email } = JSON.parse(decryptedPayload);
            const user = await User.findOne({
                where: { email }
            });

            if (user) {
                const encryptedData = encryptData(user);
                res.json({ data: encryptedData });
            } else {
                res.status(404).json({ message: 'Email not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'An error has occured' });
        }
    })

    router.post('/verifycode', async (req, res) => {
        const { encryptedPayload } = req.body;
            
        try {
            const decryptedPayload = decryptData(encryptedPayload);
            const { email, code } = JSON.parse(decryptedPayload);
            const user = await User.findOne({
                where: { email, code }
            });

            if (user) {
                const encryptedData = encryptData(user);
                res.json({ data: encryptedData });
            } else {
                res.status(404).json({ message: 'Code does not match' });
            }
        } catch (error) {
            res.status(500).json({ message: 'An error has occured' });
        }
    })

    return router;
}
