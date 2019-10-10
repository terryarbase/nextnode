Next-NodeCMS Beta v2
===================================

#System User Method


#System User Statics
##1. authorisedEmail({ email, lean, session })
###Return Mongoose Document Object or Object
- email: Email Address
- lean: Return the plain object to the callee instead of giving a Mongoose Document Object
- session: Mongoose session object

##2. authorisedPassword({ password, sysUser })
###Return Boolean
- password: Plain text for the password
- sysUser: Mongoose Document Object for the System User

##3. authorisedLockState({ sysUser, counter, lockEnabled, maxLock })
###Return Mongoose Document Object or Object
- sysUser: Mongoose Document Object for the System User
- counter: Wrong counter to be increased
- lockEnabled: Check for the locking logic
- maxLock: Maximum locking accumulator
