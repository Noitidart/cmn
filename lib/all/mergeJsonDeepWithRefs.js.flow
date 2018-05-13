function specialTypeOf(v) {
    const type = typeof v;
    if (['number', 'string', 'undefined', 'boolean'].includes(type)) {
        return type;
    } else {
        if (!v) return 'null'
        else if (Array.isArray(v)) return 'array';
        else return 'object';
    }
}

/* options has keys
{
    [key]: {
        // if array
        sortBy: function
    }
}

*/

const nonRefTypes = ['number', 'string', 'undefined', 'boolean', 'null'];
export default function mergeJsonDeepWithRefs(target, source, options={}, parentKey='root') {
    // keeps refs of things that were unchanged, but if some child changed, then ref change bubbles to top
    // deep merge
    // target/source must be array or object
    // target/source must of same type
    // if objects: source can have missing keys. meaning keys in source do not have to be in target
    // compares ref, including of root, if same it assumes its same.
    // if refs different, it goes through and checks each value, if different then parent is marked as different

    // every time an object is found with changes, that object is assigned new

    if (target === source) return target; // no changes

    const targetType = specialTypeOf(target);
    const sourceType = specialTypeOf(source);
    if (targetType !== sourceType) throw new Error('types of target and source dont match');
    if (!['array', 'object'].includes(targetType)) throw new Error('types of target and source must be array or object');

    let hasChanges = false;

    let build;

    if (targetType === 'array') {

        // if array of objects, compare id'd object
        if ((target.length && specialTypeOf(target[0]) === 'object') || (source.length && specialTypeOf(source[0]) === 'object')) {
            // treatment 1: order of target is retained, and source is just used to merge into, and remaining are concated. any new entries found in source, will be pushed onto the end, maintaining order in source

            build = [];
            const treatedSourceIds = {};

            for (let i=0; i<target.length; i++) {
                const targetValue = target[i];
                const sourceValue = source.find(entry => entry.id === targetValue.id);

                if (sourceValue) {
                    treatedSourceIds[targetValue.id] = undefined; // value doesnt matter
                    const mergedValue = mergeJsonDeepWithRefs(targetValue, sourceValue, options, parentKey+'[]');
                    build.push(mergedValue);
                    if (mergedValue !== targetValue) hasChanges = true;
                } else {
                    build.push(targetValue);
                }
            }

            // concat in remaining from source, that were not treated. in order found in source
            for (const sourceValue of source) {
                if (!treatedSourceIds.hasOwnProperty(sourceValue.id)) {
                    // this sourceValue does not exist in target
                    build.push(sourceValue);
                    hasChanges = true;
                }
            }

        } else {
            // treatment 2: order matters - array of non-objects

            // figure out if its changed
            if (target.length !== source.length) {
                hasChanges = true;
            } else {
                // check if each value same
                for (let i=0; i<target.length; i++) {
                    const targetValue = target[i];
                    const sourceValue = source[i];
                    if (targetValue !== sourceValue) {
                        hasChanges = true;
                        break;
                    }
                }
            }

            if (hasChanges) build = target.concat(source);
        }

        // maybe treatment 3 - value is like string of arrays compared? so if its changed take the source array?



        if (hasChanges && options.hasOwnProperty(parentKey)) {
            const optionsThis = options[parentKey];
            if (optionsThis.hasOwnProperty('sortBy')) build.sort(optionsThis.sortBy);
        }
    } else {
        // its object
        build = Object.assign({}, target); // because i dont iterate target's keys, and source can have missing keys

        for (const [sourceKey, sourceValue] of Object.entries(source)) {
            if (target.hasOwnProperty(sourceKey)) {
                const sourceValueType = specialTypeOf(sourceValue);
                const targetValue = target[sourceKey];
                const targetValueType = specialTypeOf(targetValue);
                if (sourceValueType !== targetValueType) {
                    // type changed
                    build[sourceKey] = sourceValue;
                    hasChanges = true;
                } else if (nonRefTypes.includes(sourceValueType)) {
                    // targetValueType and sourceValueType are same
                    build[sourceKey] = sourceValue;
                    if (build[sourceKey] !== targetValue) hasChanges = true;
                } else {
                    // targetValueType and sourceValueType are same - and both array or object
                    build[sourceKey] = mergeJsonDeepWithRefs(targetValue, sourceValue, options, sourceKey);
                    if (build[sourceKey] !== targetValue) hasChanges = true;
                }
            } else {
                build[sourceKey] = sourceValue;
                hasChanges = true;
            }
        }
    }

    if (!hasChanges) {
        return target;
    } else {
        return build;
    }
}
