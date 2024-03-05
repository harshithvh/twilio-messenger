import asyncHandler from 'express-async-handler';

const authenticateWebhook = asyncHandler( async (req, res, next) => {
    const WEBHOOK_API_KEY = req.headers['api_key'];
    if (WEBHOOK_API_KEY !== process.env.WEBHOOK_API_KEY) {
        return res.status(401).send({ error: 'Unauthorized', message: 'Invalid WEBHOOK_API_KEY provided' });
    }
    next();
});

export { authenticateWebhook };