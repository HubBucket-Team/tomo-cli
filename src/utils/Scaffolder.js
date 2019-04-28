import {join} from 'path';
import Queue from 'p-queue';
import memFs from 'mem-fs';
import editor from 'mem-fs-editor';

const {assign} = Object;
const silent = () => {};
/**
 * Class to create scaffolders when creating folders, and copying files/templates
 * @example
 * import {Scaffolder} from './utils';
 * const scaffolder = new Scaffolder();
 * await scaffolder
 *     .target('/path/to/copy/files')
 *     .copy('foo.js')
 *     .copy('bar.js')
 *     .commit();
 */
export class Scaffolder {
    /**
     *
     * @param {Object} options Scaffolding options
     * @param {string} options.sourceDirectory Source directory for template files
     */
    constructor(options = {sourceDirectory: join(__dirname, 'templates')}) {
        const {sourceDirectory} = options;
        const targetDirectory = './';
        const fs = editor.create(memFs.create());
        const queue = new Queue({concurrency: 1});
        assign(this, {fs, queue, sourceDirectory, targetDirectory});
    }
    /**
     * Set source directory
     * @param {string} sourceDirectory Source directory of template files
     * @returns {Scaffolder} Chaining OK
     */
    source(sourceDirectory) {
        return assign(this, {sourceDirectory});
    }
    /**
     * Set target directory
     * @param {string} targetDirectory Target directory of template files
     * @returns {Scaffolder} Chaining OK
     */
    target(targetDirectory) {
        return assign(this, {targetDirectory});
    }
    /**
     * Copy a file
     * @param {string} path Path string of file to be copied
     * @returns {Scaffolder} Chaining OK
     */
    copy(path) {
        const self = this;
        const {fs, queue, sourceDirectory, targetDirectory} = self;
        const source = join(sourceDirectory, path);
        const target = join(process.cwd(), targetDirectory, ...path.split('/'));
        queue.add(() => fs.copy(source, target)).catch(silent);
        return self;
    }
    /**
     * Write changes to disk
     * @return {Promise} Resolves when queue is empty
     */
    async commit() {
        const {fs, queue} = this;
        await new Promise(resolve => fs.commit(resolve));
        await queue.onEmpty();
    }
}
export default Scaffolder;