<?php

include "utilities.php";

session_start();

header('Content-Type: application/json');

$method = $_SERVER["REQUEST_METHOD"];

if (isset($_SESSION["connected"]) && $_SESSION["connected"] === true) {
    // Si l'utilisateur est connecté, il a accès à ces informations
    if ($method !== "GET") {
        renderError("La méthode $method n'est pas acceptée", 405);
    }

    // connection à la BD
    $pdo = connect_db();
    // On recupere le mot si cue est definie
    if (isset($_GET['cue'])) {
        $query = "SELECT cue FROM " . MYSQL_SCHEMA . ".usf_fan WHERE cue = :cue LIMIT 1";
        $value = [":cue" => $_GET['cue']];
        // Nous exécutons la requête
        try {
            $res = $pdo->prepare($query);
            $res->execute($value);
            $data = $res->fetch();
            if ($data) {
                echo json_encode($data);
                die();
            }
        } catch (PDOException $e) {
            dieInError("Erreur de requête dans la BD: " . $e->getMessage());
        }
    }

    // Si cue n'est pas definie ou que le mot n'existe pas en bdd
    $query = "SELECT cue FROM " . MYSQL_SCHEMA . ".usf_fan ORDER BY RAND() LIMIT 1";
    // Nous exécutons la requête
    try {
        $res = $pdo->prepare($query);
        $res->execute();
    } catch (PDOException $e) {
        dieInError("Erreur de requête dans la BD: " . $e->getMessage());
    }

    $data = $res->fetch();
    echo json_encode($data);
    die();
} else {
    // Sinon il ne peut pas avoir accès à ces informaions
    renderError("Vous devez vous connecter pour avoir accès à ces informations.", 403);
}