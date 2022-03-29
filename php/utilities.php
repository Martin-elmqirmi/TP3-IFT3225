<?php

include "db-credential.php";

/**
 * Retourne au navigateur un objet d'erreur (JSON) avec le message fourni.
 *
 * @param string $msg
 */
function dieInError($msg) {
    $data = [
        "result" => "error",
        "errorMessage" => $msg,
    ];
    echo json_encode($data);

    die();
}


/**
 * Retourne au navigateur le tableau passé en paramètre en JSON. la réponse retourné
 * contiendra l'attribut "result": "succes".
 *
 * @param array $data
 */
function dieInSuccess($data) {
    $data["result"] = "success";
    echo json_encode($data);
    die();
}

/**
 * Fonction qui nous permet de nous connecter à la Base de données.
 *
 * @return PDO
 */
function connect_db() {
    try {
        $pdo = new PDO("mysql:host=www-ens;dbname=" . MYSQL_SCHEMA, MYSQL_USER, MYSQL_PASSWORD);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        dieInError("Impossible de se connecter à la BD: " .  $e->getMessage());
    }
}

function renderError($msg, $code) {
    $data = [
        "errorMessage" => $msg
    ];
    renderJSON($data, $code);
}

function renderJSON($data = null, $code = 200) {
    header('Content-Type: application/json');
    http_response_code($code);
    if(is_null($data)) {
        echo "";
    } else {
        echo json_encode($data);
    }
}