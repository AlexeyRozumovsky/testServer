"use strict";

var fs = require('fs');

class StorageTable {

    constructor(tableName) {
        this.tableName = tableName;
        //this.loadFile();
    }

    _loadFile() {
        this.data = readJSON(this.tableName);
        this.records = this.data.records;
        this.settings = this.data.settings;
    }

    //TODO: home task - create insert many functionality
    insert(object) {
        this._loadFile();

        object.id = this._generateId();
        this.records.push(object);
        this._updateTable();
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

    //TODO - create
    remove(id) {
    }

    _updateTable() {
        writeJSON(this.tableName, {
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


function readJSON(path) {
    var json = JSON.parse(fs.readFileSync("db/" + path + ".json", 'utf8'));
    //console.log("readJSON", path, json);
    return json;
}

function writeJSON(path, content) {
    //console.log("writeJSON", path, content);

    fs.writeFileSync("db/" + path + ".json", JSON.stringify(content, null, 4));
}

module.exports = StorageTable;