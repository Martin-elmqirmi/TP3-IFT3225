/**
 * Application Sammy.js
 */
let app = Sammy('#main', function() {

    // define the principal route
    this.get('#/', function() {
        checkLoginStatus();
    });

    // define the cue route
    this.get('#/cue', function(context) {
        getCue(context);
    });

    // define the word route
    this.get("#/info/:word", function(context) {
        getWord(context);
    });

    // define top players
    this.get("#/game", function(context) {
        showGame(context);
    });

    // define top players
    this.get("#/top", function() {
        getTopPlayers();
    });
});

/**
 * Fonction qui gère tout les évenements.
 */
$(function () {
    // jQuery lance un événement quand une requête AJAX est lancée et un autre quand toutes les requêtes sont terminées.
    // Nous écoutons ces événements pour afficher et masquer un "spinner" (icône de chargement)
    $(document).on("ajaxStart", function () {
        $("body").addClass("loading");
    });

    $(document).on("ajaxStop", function () {
        $("body").removeClass("loading");
    });

    // Début du script
    app.run('#/');
});