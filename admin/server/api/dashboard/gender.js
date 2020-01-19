module.exports = async (req, res) => {
	const nextnode = req.keystone;
	const Parse = nextnode.get('parse server');
	const userQuery = new Parse.Query(Parse.User);
    const genderPipeline = [
        {
            group: {
                objectId: {
                    $toLower: '$gender',
                },
                label: {
                    $first: '$gender',
                },
                total: {
                    $sum: 1,
                },
            },
        },
    ];
    const genderClassification = await userQuery.aggregate(genderPipeline, {
    	useMasterKey: true,
    });
    console.log('Member Proportion: ', genderClassification);
	return res.json(genderClassification);
};
