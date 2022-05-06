"use strict";

import Backend from "./backend.js";
import Router from "./router.js";
import "./app.css";

let date = new Date();

/**
 * Hauptklasse App: Steuert die gesamte Anwendung
 *
 * Diese Klasse erzeugt den Single Page Router zur Navigation innerhalb
 * der Anwendung und ein Datenbankobjekt zur Verwaltung der Adressliste.
 * Darüber hinaus beinhaltet sie verschiedene vom Single Page Router
 * aufgerufene Methoden, zum Umschalten der aktiven Seite.
 */
class App {
    /**
     * Konstruktor.
     */
    constructor() {
        // Datenbank-Klasse zur Verwaltung der Datensätze
        this.backend = new Backend();

        // Single Page Router zur Steuerung der sichtbaren Inhalte
        //// TODO: Routing-Regeln anpassen und ggf. neue Methoden anlegen ////
        this.router = new Router([
            {
                url: "^/Kalender/$",
                show: () => this._gotoCal()
            },
            //// TODO: Eigene Routing-Regeln hier in der Mitte einfügen ////
            {
                url: "^/ToDoListe/$",
                show: () => this._gotoToDo()
            },
        ]);

        // Fenstertitel merken, um später den Name der aktuellen Seite anzuhängen
        this._documentTitle = document.title;

        // Von dieser Klasse benötigte HTML-Elemente
        this._pageCssElement = document.querySelector("#page-css");
        this._bodyElement = document.querySelector("body");
        this._menuElement = document.querySelector("#app-menu");
    }

    /**
     * Initialisierung der Anwendung beim Start. Im Gegensatz zum Konstruktor
     * der Klasse kann diese Methode mit der vereinfachten async/await-Syntax
     * auf die Fertigstellung von Hintergrundaktivitäten warten, ohne dabei
     * mit den zugrunde liegenden Promise-Objekten direkt hantieren zu müssen.
     */
    async init() {
        
        try {
            await this.backend.init();
            this.router.start();
        } catch (ex) {
            this.showException(ex);
        }
        
    }

    /**
     * Übersichtsseite anzeigen. Wird vom Single Page Router aufgerufen.
     */
    async _gotoCal() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageList} = await import("./page-list/page-list.js");

            let page = new PageList(this);
            await page.init();
            this._showPage(page, "Kalender");
        } catch (ex) {
            this.showException(ex);
        }
    }

    async _gotoToDo() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageList} = await import("./to-do-list/page-list.js");

            let page = new PageList(this);
            await page.init();
            this._showPage(page, "ToDoListe");
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Interne Methode zum Umschalten der sichtbaren Seite.
     *
     * @param  {Page} page Objekt der anzuzeigenden Seiten
     * @param  {String} name Name zur Hervorhebung der Seite im Menü
     */
    _showPage(page, name) {
        // Fenstertitel aktualisieren
        document.title = `${this._documentTitle} – ${page.title}`;

        // Stylesheet der Seite einfügen
        this._pageCssElement.innerHTML = page.css;

        // Aktuelle Seite im Kopfbereich hervorheben
        this._menuElement.querySelectorAll("li").forEach(li => li.classList.remove("active"));
        this._menuElement.querySelectorAll(`li[data-page-name="${name}"]`).forEach(li => li.classList.add("active"));

        // Sichtbaren Hauptinhalt austauschen
        this._bodyElement.querySelector("main")?.remove();
        this._bodyElement.appendChild(page.mainElement);
    }

    /**
     * Hilfsmethode zur Anzeige eines Ausnahmefehlers. Der Fehler wird in der
     * Konsole protokolliert und als Popupmeldung angezeigt.
     *
     * @param {Object} ex Abgefangene Ausnahme
     */
    showException(ex) {
        console.error(ex);

        if (ex.message) {
            alert(ex.message)
        } else {
            alert(ex.toString());
        }
    }
}

/**
 * Anwendung starten
 */
window.addEventListener("load", async () => {
    let app = new App();
    
    await app.init();
    alert("Test32");
    let data = await app.backend.fetch("GET", '/db/app_database/example', "");
    
    alert("data[0]");
    
    
    /** 
    document.getElementById("moveRight").addEventListener("right", moveRight());
  
    document.getElementById("moveLeft").addEventListener("left", moveLeft());
  
    dateValue(); 
    clear(); 
    draw();  
    **/
});

// function moveLeft() {
//     alert("Test");
//     date.setMonth(date.getMonth() - 1);
//     dateValue();
//     clear();
//     draw();
// }

// function moveRight() {
//     date.setMonth(date.getMonth() + 1);
//     dateValue();
//     clear();
//     draw();
// }

// function dateValue() {
    
//     var monat = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    
//     var ausgabe = monat[date.getMonth()] + " " + date.getFullYear();
    
//     document.getElementById("month").textContent = ausgabe;
// }

// function draw() {
//     var helpDate = new Date(date.getFullYear(), date.getMonth(), 1);
//     var grey = 1;
//     var start = 1;
//     var vergleich = [7, 0, 1, 2, 3, 4, 5, 6];
//     start = start + vergleich[helpDate.getDay()];
//     var id = "";
//     while (grey  < start) {
//         id = "calendar_entry_" + grey;
//         document.getElementById(id).style.backgroundColor = "grey";
//         grey = grey + 1;
//     }
//     var counter = 0;
//     while (helpDate.getMonth() == date.getMonth()) {
//         counter = counter + 1;
//         id = "calendar_entry_" + start;
//         document.getElementById(id).textContent = counter;
//         start = start + 1;
//         helpDate.setDate(helpDate.getDate() + 1); 
//     }
//     while (start < 43) {
//         id = "calendar_entry_" + start;
//         document.getElementById(id).style.backgroundColor = "grey";
//         start = start + 1;
//     }
// }

// function clear() {
//     var counter = 1;
//     var id = "";
//     while (counter < 43) {
//         id = "calendar_entry_" + counter;
//         document.getElementById(id).textContent = "";
//         document.getElementById(id).style.backgroundColor = "white";
//         counter = counter + 1;
//     }
// }
