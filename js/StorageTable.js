"use strict";

var utils = require('../utils');

class StorageTable {

    constructor(tableName) {
        this.tableName = tableName;
        //this.loadFile();
    }

    _loadFile() {
        // console.log("THIS", this);
        this.data = utils.readJSON(this.tableName);
        this.records = this.data.records;
        this.settings = this.data.settings;
        //console.log(this.settings);
    }

    insert(objectToInsert) {
        let me = this;

        if (Array.isArray(objectToInsert)) {
            objectToInsert.forEach(me.insert.bind(me));
        } else {
            me._loadFile();

            objectToInsert.id = me._generateId();
            me.records.push(objectToInsert);
            me._updateTable();
        }
    }

    get(id) {
        var result;

        this._loadFile();

        this.records.forEach(function (record) {
            if (record.id === id) {
                result = record;
            }
        });

        return result;
    }

    getAll() {
        this._loadFile();

        return JSON.stringify(this.records);
    }

    update(object) {
        var me = this,
            id = object.id;

        this._loadFile();

        this.records.forEach(function (record, index) {
            if (record.id === id) {
                me.records[index] = object;
            }
        });

        this._updateTable();
    }

    remove(id) {
        var me = this;

        if (Array.isArray(id)) {
            id.forEach(me.remove.bind(me));
        } else {
            me._loadFile();
            me.records.forEach(function (record, index, array) {
                if (record.id === parseInt(id)) {
                    array.splice(index, 1);
                }
            });

            me._updateTable();
        }
    }

    _updateTable() {
        utils.writeJSON(this.tableName, {
            settings: this.settings,
            records: this.records
        });
    }

    _generateId() {
        return ++this.settings.autoIncrement;
    }

}

module.exports = StorageTable;