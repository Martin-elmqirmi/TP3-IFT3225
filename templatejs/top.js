/**
 * Fonction qui retourne les joueurs qui ont les meilleurs scores.
 */
function getTopPlayers() {
    $.get("php/top.php", function (data) {
        let htmlTop = "";
        if (data === "") {
            htmlTop = "<h1 class='mt-5 text-center'>Aucune données trouvé</h1>";
        } else {
            htmlTop = "<h1 class='mt-5 text-center'>Classement des meilleurs joueurs</h1>";
            htmlTop += "<div class='mt-5 text-center'>" +
                "<a class=\"btn btn-primary mt-3\"" +
                " href=\"http://www-etud.iro.umontreal.ca/~elmqirmm/projet3/psycho.html#/\"" +
                " role=\"button\">Retour au menu</a></div>"
            htmlTop += "<table class=\"table mt-5 container\">\n" +
                "  <thead>\n" +
                "    <tr>\n" +
                "      <th scope=\"col\">Rang</th>\n" +
                "      <th scope=\"col\">Prénom</th>\n" +
                "      <th scope=\"col\">Nom</th>\n" +
                "      <th scope=\"col\">Nombre de parties</th>\n" +
                "      <th scope=\"col\">Meilleur score</th>\n" +
                "    </tr>\n" +
                "  </thead>\n" +
                "  <tbody>"
            data.forEach(function(item, index) {
                htmlTop += "<tr>\n" +
                    "      <td scope=\"col\">" + (index + 1) + "</td>\n" +
                    "      <td scope=\"col\">" + item.first_name + "</td>\n" +
                    "      <td scope=\"col\">" + item.last_name + "</td>\n" +
                    "      <td scope=\"col\">" + item.nb_game + "</td>\n" +
                    "      <td scope=\"col\">" + item.score + "</td>\n" +
                    "    </tr>"
            });
            htmlTop += " </tbody>\n" +
                "</table>";
        }
        $("#main").html(htmlTop);
    });
}