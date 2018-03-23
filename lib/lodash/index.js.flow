import { isPlainObject, isEmpty, keyBy } from 'lodash'

// https://stackoverflow.com/a/49437903/1828637
// used to be mergeWith customizer, but mergeWith doesnt allow setting undefined, so changed to assignWith customizer
// assignWith customizer.
// by default assignWith keeps refs to everything,
// this customizer makes it so that ref is only kept if unchanged
// and a shallow copy is made if changed. this shallow copy continues deeply.
// supports arrays of collections (by id).
export default function keepUnchangedRefsOnly(objValue, srcValue) {
    if (objValue === undefined) { // do i need this?
        return srcValue;
    } else if (isPlainObject(objValue)) {
        return assignWith({}, objValue, srcValue, keepUnchangedRefsOnly);
    } else if (Array.isArray(objValue)) {
        if (isEmpty(objValue) && !isEmpty(srcValue))return [...srcValue];
        else if (!isEmpty(objValue) && isEmpty(srcValue)) return objValue;
        else if (isEmpty(objValue) && isEmpty(srcValue)) return objValue; // both empty
        else {
            // if array is array of objects, then assume each object has id, and merge based on id
            // so create new array, based objValue. id should match in each spot

            if (isPlainObject(objValue[0]) && objValue[0].hasOwnProperty('id')) {
                const srcCollection = keyBy(srcValue, 'id');

                const aligned = objValue.map(el => {
                    const { id } = el;
                    if (srcCollection.hasOwnProperty(id)) {
                        const srcEl = srcCollection[id];
                        delete srcCollection[id];
                        return assignWith({}, el, srcEl, keepUnchangedRefsOnly);
                    } else {
                        return el;
                    }
                });

                aligned.push(...Object.values(srcCollection));

                return aligned;
            } else {
                return [ ...objValue, ...srcValue ];
            }
        }
    }
}
