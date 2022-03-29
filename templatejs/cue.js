/**
 * Fonction qui affiches les mots CUE avec une limite et un offset donné
 * @param context
 */
function getCue(context) {
    context = {
        limit: context.params.limit,
        offset: context.params.offset
    }

    $.get("php/cue.php", context, function (data) {
        let htmlCue = "";
        if (data !== "") {
            htmlCue += "<h1 class='mt-5 text-center'>Visualisation des mots CUE</h1>";
            htmlCue += "<div class='text-center mt-5'>" +
                "<a class=\"btn btn-primary mt-3\"" +
                " href=\"http://www-etud.iro.umontreal.ca/~elmqirmm/projet3/psycho.html#/\"" +
                " role=\"button\">Retour au menu</a></div>";
            htmlCue += "<table class=\"table container mt-5\">\n" +
                "  <thead>\n" +
                "    <tr>\n" +
                "      <th scope=\"col\">CUE</th>\n" +
                "    </tr>\n" +
                "  </thead>" +
                "  <tbody>";
            data.forEach(function(item) {
                htmlCue += "<tr>\n" +
                    "      <td scope=\"row\">" +
                    "<a href='http://www-etud.iro.umontreal.ca/~elmqirmm/projet3/psycho.html#/info/" + item[0] + "'>"
                    + item[0] +
                    "</a></td>\n" +
                    "    </tr>" ;
            });
            htmlCue += " </tbody>\n" +
                "</table>";
        }
        $("#main").html(htmlCue);
    });
}