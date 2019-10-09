/*
** Config all of tasks to be executed for the tasks installation
** Terry Chan
** 09/10/2019
*/
const installationTasks = [
    {
        name: 'AdminUI Fields Type Plugin',
        installer: require('./../tasks/fieldtype'),
    },
    {
        name: 'React-sacript Executable Script',
        installer: require('./../tasks/reactscript'),
    },
];

module.exports = installationTasks;
