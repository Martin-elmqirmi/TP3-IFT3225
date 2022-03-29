/**
 * Fonction qui vérifie le status de connexion
 */
function checkLoginStatus() {
    $.get("php/is-connected.php", null, function (data) {
        if (data === false) {
            insertHtmlForms();
            handleLogin();
            handleRegistration();
        } else {
            insertHtmlMenu();
        }
    });
}

/**
 * Fonction qui gère la connexion
 *
 * Elle récupère les données du formulaire de login puis envoie un requête AJAX au fichier
 * login.php afin que ce dernier la traite.
 */
function handleLogin() {
    $('#login-form form').submit(function (event) {
        event.preventDefault();

        // Nous emballons l'élément `<form>` dans un objet jQuery
        const form = $(this);

        // Données à envoyer par AJAX au script serveur
        const formData = {
            "email": form.find("input[id=login-email]").val(),
            "password": form.find("input[id=login-password]").val(),
        }

        // Nous faisons la requête AJAX, par POST et traitons le résultat lorsqu'il arrive
        $.post("php/login.php", formData, function (data) {
            if (data.result === "error") {
                loginError = $("#login-form .error-message");
                loginError.html("Erreur de serveur: " + data.errorMessage);
                loginError.show();
                return;
            }

            if (data.found === false) {
                // La connexion a échoué
                $("#login-form .error-message").show();
            } else {
                // L'utilisateur est bien connecté
                checkLoginStatus();
            }
        });
    });
}

/**
 * Fonction qui gère l'inscription d'un utilisateur
 *
 * Elle récupère les données du formulaire d'inscription et les transmet
 * au fichier register.php pour qu'il les traites
 */
function handleRegistration() {
    $('#register-form form').submit(function (event) {
        event.preventDefault();

        // Nous emballons l'élément `<form>` dans un objet jQuery
        const form = $(this);

        // Données à envoyer par AJAX au script serveur
        const formData = {
            "first_name": form.find("input[id=register-first-name]").val(),
            "last_name": form.find("input[id=register-last-name]").val(),
            "email": form.find("input[id=register-email]").val(),
            "password": form.find("input[id=register-password]").val(),
            "confirmation_password": form.find("input[id=register-password-confirmation").val(),
        }

        // Nous faisons la requête AJAX, par POST et traitons le résultat lorsqu'il arrive
        $.post("php/register.php", formData, function (data) {
            if (data.result === "error") {
                registerForm.text("Erreur de serveur" + data.errorMessage);
                registerForm.show();
                return;
            } else if (data.contentError === true){
                let registerForm = $("#register-form .error-message");
                registerForm.text(data.errorMessage);
                registerForm.show();
            } else {
                checkLoginStatus();
            }
        });
    });
}

/**
 * Fonction qui affiche les formulaire de connexion et d'inscription
 */
function insertHtmlForms() {
    $("#main").html(htmlIndex);
}

/**
 * Fonction qui affiche le menu une fois que l'utilisateur est connecté
 */
function insertHtmlMenu() {
    $("#main").html(htmlMenu);
}


/**
 * Html pour le menu principal
 * @type {string}
 */
let htmlMenu = "<div class='text-center'>" +
    "<h1 class='bg-green text-white p-3'>" +
    "Menu des activités" +
    "</h1>" +
    "</div>" +
    "<div class=\"row mt-5\">\n" +
    "    <div class=\"col-4 text-center\">\n" +
    "        <a href=\"http://www-etud.iro.umontreal.ca/~elmqirmm/projet3/psycho.html#/cue\" class=\"text-green\">\n" +
    "            Accéder au menu des CUE</a>\n" +
    "    </div>\n" +
    "    <div class=\"col-4 text-center\">\n" +
    "        <a href=\"http://www-etud.iro.umontreal.ca/~elmqirmm/projet3/psycho.html#/game\" class=\"text-green\">\n" +
    "            Accéder Jeu</a>\n" +
    "    </div>\n" +
    "    <div class=\"col-4 text-center\">\n" +
    "        <a href=\"http://www-etud.iro.umontreal.ca/~elmqirmm/projet3/psycho.html#/top\" class=\"text-green\">\n" +
    "            Accéder au tableau des meilleurs joueur</a>\n" +
    "    </div>\n" +
    "</div>";


/**
 * Html pour les formulaires
 *
 * @type {string}
 */
let htmlIndex = "<div class=\"container login-container\" id=\"forms\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-5\" id=\"login-form\">\n" +
    "            <h3>Connection</h3>\n" +
    "            <form action='#/'>\n" +
    "                <p class=\"error-message\">Les informations de connexion sont invalides.</p>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"login-email\">Email</label>\n" +
    "                    <input type=\"email\" class=\"form-control\" id=\"login-email\"\n" +
    "                           placeholder=\"Entrez votre email\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"login-password\">Mot de passe</label>\n" +
    "                    <input type=\"password\" class=\"form-control\" id=\"login-password\"\n" +
    "                           placeholder=\"Entrez votre mot de passe\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group mt-3\">\n" +
    "                    <button class=\"btnSubmit login-submit\" type=\"submit\">Se connecter</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "        <div class=\"offset-md-2 col-md-5\" id=\"register-form\">\n" +
    "            <h3>Inscription</h3>\n" +
    "            <form action='#/'>\n" +
    "                <p class=\"error-message\"></p>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"register-first-name\">Prenom</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" id=\"register-first-name\"\n" +
    "                           placeholder=\"Entrez votre prénom\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"register-last-name\">Nom</label>\n" +
    "                    <input type=\"text\" class=\"form-control\" id=\"register-last-name\"\n" +
    "                           placeholder=\"Entrez votre nom\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"register-email\">Email</label>\n" +
    "                    <input type=\"email\" class=\"form-control\" id=\"register-email\"\n" +
    "                           placeholder=\"Entrez votre email\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"register-password\">Mot de passe</label>\n" +
    "                    <input type=\"password\" class=\"form-control\" id=\"register-password\"\n" +
    "                           placeholder=\"Entrez un mot de passe\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"register-password-confirmation\">Confirmation mot de passe</label>\n" +
    "                    <input type=\"password\" class=\"form-control\" id=\"register-password-confirmation\"\n" +
    "                           placeholder=\"Entrez à nouveau le mot de passe\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group mt-3\">\n" +
    "                    <button class=\"btnSubmit register-submit\" type=\"submit\">S'inscrire</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"