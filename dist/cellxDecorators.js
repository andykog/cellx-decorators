"use strict";
var cellx_1 = require("cellx");
var assign = Object.assign || function (target, source) {
    for (var name_1 in source) {
        target[name_1] = source[name_1];
    }
    return target;
};
/**
 * Babel:
 * desc с добавленным initializer.
 *
 * Typescript:
 * desc - undefined или результат предыдущего декоратора.
 * Результат `any | void`: https://github.com/Microsoft/TypeScript/issues/8063
 */
function cellDecorator(targetOrOptions, name, desc, opts) {
    if (arguments.length == 1) {
        return function (target, name, desc) {
            return cellDecorator(target, name, desc, targetOrOptions);
        };
    }
    var privateName = '_' + name;
    return {
        configurable: true,
        enumerable: desc ? desc.enumerable : true,
        get: function () {
            return (this[privateName] || (this[privateName] = new cellx_1.Cell(desc.initializer(), opts ? (opts['owner'] === undefined ? assign({ owner: this }, opts) : opts) : { owner: this }))).get();
        },
        set: function (value) {
            if (this[privateName]) {
                this[privateName].set(value);
            }
            else {
                this[privateName] = new cellx_1.Cell(value, opts ? (opts['owner'] === undefined ? assign({ owner: this }, opts) : opts) : { owner: this });
            }
        }
    };
}
exports.observable = cellDecorator;
exports.computed = cellDecorator;
exports.cell = cellDecorator;
