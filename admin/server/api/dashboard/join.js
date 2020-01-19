const moment = require('moment');

module.exports = async (req, res) => {
	const nextnode = req.keystone;
	const Parse = nextnode.get('parse server');
    const userQuery = new Parse.Query(Parse.User);
    const beforeYear = moment().subtract(11, 'months').startOf('month').startOf('day').toDate();
    const endOfMonth = moment().endOf('month').endOf('day').toDate();
    const joinPipeline = [
        {
            match: {
                createdAt: {
                    $gte: beforeYear,
                    $lte: endOfMonth,
                },
            },
        },
        {
            project: {
                representive: {
                    $dateToString: {
                        format: '%Y/%m',
                        date: '$_created_at',
                    },
                },
            },
        },
        {
            group: {
                objectId: {
                    $toLower: '$representive',
                },
                label: {
                    $first: '$representive',
                },
                total: {
                    $sum: 1,
                },
            },
        },
        {
            sort: {
                label: 1,
            },
        },
    ];
    const joinStatistic = await userQuery.aggregate(joinPipeline, { useMasterKey: true });
    console.log('Member Join Statistic: ', joinStatistic);
	return res.json(joinStatistic);
};
