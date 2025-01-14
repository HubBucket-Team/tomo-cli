import {
    PackageJsonEditor,
    install,
    uninstall
} from '../utils';
import {allDoExist} from '../utils/common';
/**
 * @type {task[]}
 * @see http://pa11y.org/
 */
export const addA11y = [
    {
        text: 'Add accessibility tasks to package.json',
        task: async ({outputDirectory}) => {
            const scripts = {
                'lint:aria': `pa11y ${outputDirectory}/index.html`
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Install pa11y for checking accessibility rules',
        task: ({skipInstall}) => install(['pa11y'], {dev: true, skipInstall}),
        condition: ({isNotOffline}) => isNotOffline && allDoExist('package.json')
    }
];
export const removeA11y = [
    {
        text: 'Remove accessibility tasks from package.json',
        task: async () => {
            const scripts = {
                'lint:aria': undefined
            };
            await (new PackageJsonEditor())
                .extend({scripts})
                .commit();
        },
        condition: () => allDoExist('package.json')
    },
    {
        text: 'Uninstall pa11y',
        task: () => uninstall(['pa11y']),
        condition: ({skipInstall}) => !skipInstall && allDoExist('package.json') && (new PackageJsonEditor()).hasAll('pa11y'),
        optional: ({skipInstall}) => !skipInstall
    }
];
export default addA11y;