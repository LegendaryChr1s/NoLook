"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Adressen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Adressen werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class TerminService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._termine = DatabaseFactory.database.collection("example");
    }

    /**
     * Adressen suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Adressen
     */
    async search(query) {
        let cursor = this._termine.find(query, {
            sort: {
                title: 1,
               
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern einer neuen Adresse.
     *
     * @param {Object} termine Zu speichernde Adressdaten
     * @return {Promise} Gespeicherte Adressdaten
     */
    async create(termine) {
        termine = termine || {};

        let newtermine = {
            title: termine.title || "",
            author:  termine.author  || "",
            publisher:      termine.publisher     || "",
            year:      termine.year      || "",
        };

        let result = await this._termine.insertOne(newtermine);
        return await this._termine.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Gefundene Adressdaten
     */
    async read(id) {
        let result = await this._termine.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung einer Adresse, durch Überschreiben einzelner Felder
     * oder des gesamten Adressobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Adresse
     * @param {[type]} termine Zu speichernde Adressdaten
     * @return {Promise} Gespeicherte Adressdaten oder undefined
     */
    async update(id, termine) {
        let oldtermine = await this._termine.findOne({_id: new ObjectId(id)});
        if (!oldtermine) return;

        let updateDoc = {
            $set: {},
        }

        if (termine.title) updateDoc.$set.title = termine.title;
        if (termine.author)  updateDoc.$set.author  = termine.author;
        if (termine.publisher)      updateDoc.$set.publisher      = termine.publisher;
        if (termine.year)      updateDoc.$set.year      = termine.year;

        await this._termine.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._termine.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen einer Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._termine.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}