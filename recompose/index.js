import shallowEqualDefault from 'recompose/shallowEqual'
export function shallowEqual(arrobj1, arrobj2) {
    // modified so that it does shallowEqual on each element in array, as that is so common in react
    // this is safe because if i ever wanted to compare two arrays, i always just do !== instead of a function like shallowEqual
    if (Array.isArray(arrobj1) && Array.isArray(arrobj2)) {
        if (arrobj1.length !== arrobj2.length) return false;

        const l = arrobj1.length;
        for(let i=0; i<l; i++) {
            const el1 = arrobj1[i];
            const el2 = arrobj2[i];
            if (!shallowEqualDefault(el1, el2)) return false;
        }
    } else {
        // treat each as an object
        return shallowEqualDefault(arrobj1, arrobj2);
    }

    return true;
}

