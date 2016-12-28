"use strict";

var utils = require('../utils');

class StorageTable {

    constructor(tableName) {
        this.tableName = tableName;
        //this.loadFile();
    }

    _loadFile() {
        console.log("THIS", this);
        this.data = utils.readJSON(this.tableName);
        this.records = this.data.records;
        this.settings = this.data.settings;
        console.log(this.settings);
    }

    //TODO: DONE - show to kotik // H.W. - create insert many functionality
    // Yes, we can avoid to call private method _tryToInsert and place its code to ELSE block, but this way we have make recursive calls
    insert(objectToInsert) {
        let me = this;

        if (Array.isArray(objectToInsert)) {
            objectToInsert.forEach(me._tryToInsert.bind(me));
        } else {
            me._tryToInsert(objectToInsert)
        }
    }

    _tryToInsert(objectToInsert) {
        let me = this;

        me._loadFile();

        objectToInsert.id = me._generateId();
        me.records.push(objectToInsert);
        me._updateTable();
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

        return this.records;
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

    //TODO DONE - show to kotik // H.W.- create
    remove(id) {
        var me = this;

        if (Array.isArray(id)) {
            id.forEach(me.remove.bind(me));
        } else {
            me._loadFile();
            me.records.forEach(function (record, index, array) {
                if (record.id === id) {
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

/*var treem = new StorageTable("treem");


 console.log(treem.getAll().filter(function (record) {
 return record.type == "active";
 }));*/


var treem = new StorageTable("treem");

// treem.insert([
//     {
//         "text": "array 1",
//         "type": "active"
//     },
//     {
//         "text": "array 2!",
//         "type": "active"
//     },
//     {
//         "text": "array 3",
//         "type": "active"
//     },
//     {
//         "text": "array 4",
//         "type": "active"
//     }]);
//
// treem.insert({
//     "text": "single",
//     "type": "active"
// });

//treem.remove([16,17]);



module.exports = StorageTable;