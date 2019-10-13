Next-NodeCMS Beta v2
===================================

#System User Session Method


#System User Session Statics
##findByTokenType({ token, session, type, lean, population })
### Return Mongoose Document Object or Object
- token: Token to be validated
- session: Mongoose session object
- type: Type to be matched to the given token
- lean: Return the plain object to the callee instead of giving a Mongoose Document Object
- population: Lookup for the relationship System User Entity

##refreshTheToken({ sysUser, sysUserSession }) - replace the existing System User Session with a new pair Session Token and Refresh Token
### Return Mongoose Document Object
- sysUser: Mongoose Document Object for the System User
- sysUserSession: Mongoose Document Object for the System User Session

##generateTheToken({ sessionEntity, payload })
### Return Mongoose Document Object
- sessionEntity: System User Session Entity (Mongoose Document) to be found from any query by using any finding operation
- payload: Object to be used as payload in the jwt body 
