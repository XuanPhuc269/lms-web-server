import { clerkClient } from "@clerk/express";

export const protectEducator = async (req, res, next) => {
    try {
        const userId = req.auth.userId;
        const response = await clerkClient.users.getUser(userId);

        if (response.publicMetadata.role !== 'educator') {
            return res.status(403).json({ message: 'Access denied. Educator role required.' });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
}