"use strict";

var utils = require('../utils'),
    notifier = new (require('../clientNotifier.js'))();


class StorageTable {

    constructor(tableName) {
        this.tableName = tableName;
    }

    _loadFile() {
        const me = this;

        me.data = utils.readJSON(me.tableName);
        me.records = me.data.records;
        me.settings = me.data.settings;
        me.requiredFields = me.settings.fields;
    }

    insert(objectToInsert) {
        let me = this;

        if (Array.isArray(objectToInsert)) {
            objectToInsert.forEach(me.insert.bind(me));
        } else if (me._checkTheValidity(objectToInsert)) {

            me._loadFile();

            objectToInsert.id = me._generateId();
            me.records.push(objectToInsert);
            me._updateTable();

            notifier.updateClients(me.tableName);
        } else {
            notifier.sendMessage("Invalid smile");
        }
    }

    _checkTheValidity(objectToInsert) {
        const me = this;
        let counter = 0,
            requiredNum = Object.keys(me.requiredFields).length,
            key;

        for (key in objectToInsert) {
            if (objectToInsert.hasOwnProperty(key) && (typeof objectToInsert[key] === me.requiredFields[key])) {
                counter++;
            }
        }

        return counter === requiredNum;
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

        notifier.updateClients(me.tableName);
    }

    remove(id) {
        var me = this;

        if (Array.isArray(id)) {
            id.forEach(me.remove.bind(me));
        } else {
            me._loadFile();
            me.records.forEach(function (record) {
                if (record.id === parseInt(id)) {
                    record.active = false;
                }
            });

            me._updateTable();

            notifier.updateClients(me.tableName);
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