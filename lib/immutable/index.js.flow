import { Iterable } from 'immutable'

export function isImmutable(target) {
    if (!target) return false; // if undefined or null (if 0 or blank string as well)
    else return Iterable.isIterable(target);
}