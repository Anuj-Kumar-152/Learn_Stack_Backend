const checkAccess = (user) => {
    if (!user || !['ADMIN', 'EMPLOYEE'].includes(user.role)) {
        throw new Error('Access Denied: You do not have permission to perform this action');
    }
};

module.exports = { checkAccess };
