import qiwiApi from '@qiwi/bill-payments-node-js-sdk';

export default (req, res) => {
    if (req.method === 'POST') {

        const validSignatureFromNotificationServer = res.getHeader('X-Api-Signature-SHA256');
        console.log('req.body - ', req.body)
        console.log('X-Api-Signature-SHA256 - ', validSignatureFromNotificationServer)
        const notificationData = {
            bill: {
                siteId: 'test',
                billId: 'test_bill',
                amount: { value: 1, currency: 'RUB' },
                status: { value: 'PAID', datetime: '2018-03-01T11:16:12+03' },
                customer: {},
                customFields: {},
                creationDateTime: '2018-03-01T11:15:39+03:',
                expirationDateTime: '2018-04-15T11:15:39+03'
            },
            version: '1'
        };

        // qiwiApi.checkNotificationSignature(
        //     validSignatureFromNotificationServer, notificationData, process.env.NEXT_PUBLIC_QIWI_SECRET_KEY
        // );
        res.json('hello');
        return;
        // if (!('token' in req.cookies)) {
        //     res.status(401).json({message: 'Не получилось войти'});
        //     return;
        // }
        // let decoded;
        // const token = req.cookies.token;
        // if (token) {
        //     try {
        //         decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
        //     } catch (e) {
        //         console.error(e);
        //     }
        // }
        //
        // if (decoded) {
        //     res.json(decoded);
        //     return;
        // } else {
        //     res.status(401).json({message: 'Не получилось войти'});
        // }
    }
};
