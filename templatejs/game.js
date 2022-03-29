/**
 * Fonction qui fait commencer le jeu.
 *
 * @param data
 */
function beginGame(data) {
    startTimer(data);
}

/**
 * Fonction qui récupère les données entrer pour le jeu et qui les envoie
 * vers le script game.php qui les traitent.
 *
 * @param data
 */
function checkInput(data) {
    let array = $("textarea[id=input-game]").val();
    let tab = array.split(", ");

    const answerData = {
        "tab_data": tab,
        "mot": data
    }

    $.post("php/game.php", answerData, function(data) {
        let htmlResponse = "";
        if(data.data.length) {
            htmlResponse = "<h1 class='mt-5 text-center'>Visualisation du score</h1>";
            htmlResponse += "<div class='text-center'><a class='mt-5 btn btn-primary mt-3'" +
                " href='http://www-etud.iro.umontreal.ca/~elmqirmm/projet3/psycho.html#/game'>" +
                "Recommencer</a> <br>" +
                "<a class=\"btn btn-primary mt-3\" href=\"http://www-etud.iro.umontreal.ca/~elmqirmm/projet3/psycho.html#/\"" +
                " role=\"button\">Retour au menu</a></div>";
            htmlResponse += "<table class=\"table mt-5 container\">\n" +
                "  <thead>\n" +
                "    <tr>\n" +
                "      <th scope=\"col\">CUE</th>\n" +
                "      <th scope=\"col\">TARGET</th>\n" +
                "      <th scope=\"col\">MSG</th>\n" +
                "    </tr>\n" +
                "  </thead>\n" +
                "  <tbody>";
            data.data.forEach(function(item) {
                if(Object.keys(data.output).includes(item)) {
                    htmlResponse += "<tr class='text-success'>\n" +
                        "      <th scope=\"row\">" + data.mot + "</th>\n" +
                        "      <th>" + item + "</th>\n" +
                        "      <th>" + data.output[item][0].msg + "</th>\n" +
                        "    </tr>";
                } else {
                    htmlResponse += "<tr>\n" +
                        "      <th scope=\"row\">" + data.mot + "</th>\n" +
                        "      <th>" + item + "</th>\n" +
                        "      <th>- -</th>\n" +
                        "    </tr>";
                }
            });
            htmlResponse += "</tbody>\n" +
                "</table>";
            htmlResponse += "<h3 class='text-center'>Votre score est  de " + data.score + "</h3>";
        }
        $("#main").html(htmlResponse);
    });
}

/**
 * Fonction qui permet d'afficher le menu du jeu avec un mot choisis
 *
 * @param context
 */
function showGame(context) {
    $('#main').html(htmlGameMenu);
    $("#game-begin").click(function () {
        let data = {
            cue: context.params.cue,
        }

        $.get("php/get-mot.php", data, function(data) {
            insertHtmlGameMenu(data[0])
            setTimer(context.params.time);
            beginGame(data[0]);
        })
    });
}

/**
 * Fonction qui insère le menu du jeu sur la page
 *
 * @param mot
 */
function insertHtmlGameMenu(mot) {
    let htmlGameBegin = "<div class=\"game row container mt-5\">\n" +
        "    <div class=\"col-3 timer\">\n" +
        "        <div id=\"coolDown\" class=\"text-center\"> </div>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"col-9\">\n" +
        "        Veuillez entrez les mots en  relations avec le mot :\n" + mot +
        "        <textarea class=\"form-control\" id=\"input-game\" rows=\"3\"></textarea>\n" +
        "    </div>\n" +
        "</div>"
    $("#main").html(htmlGameBegin);
}

let htmlGameMenu = "<h1 class='bg-green text-white text-center p-3'>JEU</h1>" +
    "<div class=\"game-menu container mt-5\">\n" +
    "    Lorsque vous allez commencer le jeu, vous allez devoir entrer le plus de mots qui sont en rapport\n" +
    "    avec un mot donné aléatoirement dans un textArea. Vous devrez écrire les mots comme ci-dessous :<br>\n" +
    "    BONJOUR, AUREVOIR <br>\n" +
    "    Ou vos mots sont BONJOUR et AUREVOIR. <br>\n" +
    "    <button type=\"button\" id='game-begin' class=\"btn btn-dark mt-4\">Commencer le Jeu</button>\n" +
    "</div>";