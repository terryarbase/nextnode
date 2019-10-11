const ServerConfig = {
	userSession: {
		modelName: 'SystemUserSession',
		expireAfterSeconds: 86400,			// 1 day in seconds format
		maxSessionPerUser: 3,
		jwtTokens: {
			sessionToken: {
				secret: 'kPW64t@^@ye!7WYQ%=_e7w%xmgjs7#p3NggtWyKW6N8an7F*+VxR%RXUmptGcD6=4aKsc4N-*R@qtD@BhKbp+r?JKvT=un#Sgdm%TMrNN46^Z_HY=gH2swjDheAbxdja',
				expiresIn: 2678400000,			// 31 days in milisecond format (https://github.com/zeit/ms)
			},
			refreshToken: {
				secret: 'E5fxYPrp2dyRA%$xn52gAU2&5f2?ER23-#ZDYdmv2u&dr!HHr#3?FM*$KU=abg3$m!Zcc^Xne^UkUEEq$HAnjmHG#WDba4+RT!BCS@GzP^Km#kjLU4a2bQ*#j-Y6AnYG',
				expiresIn: 2764800000,			// 32 days in milisecond format (https://github.com/zeit/ms)
			},
		},
	},
};

module.exports = ServerConfig;
