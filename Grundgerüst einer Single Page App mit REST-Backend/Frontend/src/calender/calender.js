import Page from "../page.js";
import HtmlTemplate from "./calender.html";

/**
 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class PageList extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     */
    constructor(app) {
        super(app, HtmlTemplate);
        this._emptyMessageElement = null;
    }

    /**
     * HTML-Inhalt und anzuzeigende Daten laden.
     *
     * HINWEIS: Durch die geerbte init()-Methode wird `this._mainElement` mit
     * dem <main>-Element aus der nachgeladenen HTML-Datei versorgt. Dieses
     * Element wird dann auch von der App-Klasse verwendet, um die Seite
     * anzuzeigen. Hier muss daher einfach mit dem üblichen DOM-Methoden
     * `this._mainElement` nachbearbeitet werden, um die angezeigten Inhalte
     * zu beeinflussen.
     */
    async init() {
        // HTML-Inhalt nachladen
        await super.init();
        this._title = "Übersicht";
        //// TODO: Anzuzeigende Inhalte laden mit this._app.backend.fetch() ////
        //// TODO: Inhalte in die HTML-Struktur einarbeiten ////
        //// TODO: Neue Methoden für Event Handler anlegen und hier registrieren ////

        const links = document.getElementById("moveLeft");
        links.addEventListener("click", moveLeft);
    
        const rechts = document.getElementById("moveRight");
        rechts.addEventListener("click", moveRight);
        
        dateValue(); 
        clear(); 
        draw();  
        
    }

};
    
function moveLeft() {
    date.setMonth(date.getMonth() - 1);
    dateValue();
    clear();
    draw();
}

function moveRight() {
    date.setMonth(date.getMonth() + 1);
    dateValue();
    clear();
    draw();
}

function dateValue() {
    
    var monat = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    
    var ausgabe = monat[date.getMonth()] + " " + date.getFullYear();
    
    document.getElementById("month").textContent = ausgabe;
}

function draw() {
    var helpDate = new Date(date.getFullYear(), date.getMonth(), 1);
    var grey = 1;
    var start = 1;
    var vergleich = [6, 0, 1, 2, 3, 4, 5];
    start = start + vergleich[helpDate.getDay()];
    var id = "";
   
    while (grey  < start) {
        id = "calendar_entry_" + grey;
        document.getElementById(id).style.backgroundColor = "#d3d3d3";
        grey = grey + 1;
    }
    var counter = 0;
    while (helpDate.getMonth() == date.getMonth()) {
        counter = counter + 1;
        id = "calendar_entry_" + start;
        document.getElementById(id).textContent = counter;
        start = start + 1;
        helpDate.setDate(helpDate.getDate() + 1); 
    }
    while (start < 43) {
        id = "calendar_entry_" + start;
        document.getElementById(id).style.backgroundColor = "#d3d3d3";
        start = start + 1;
    }
}

function clear() {
    var counter = 1;
    var id = "";
    while (counter < 43) {
        id = "calendar_entry_" + counter;
        document.getElementById(id).textContent = "";
        document.getElementById(id).style.backgroundColor = "white";
        counter = counter + 1;
    }
}