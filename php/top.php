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
    $query = "SELECT first_name, last_name, nb_game, score FROM " . MYSQL_SCHEMA . ".users ORDER BY score DESC LIMIT 10";

    // Nous exécutons la requête
    try {
        $res = $pdo->prepare($query);
        $res->execute();
    } catch (PDOException $e) {
        dieInError("Erreur de requête dans la BD: " . $e->getMessage());
    }

    $data = $res->fetchAll();
    echo json_encode($data);
    die();
} else {
    // Sinon il ne peut pas avoir accès à ces informaions
    renderError("Vous devez vous connecter pour avoir accès à ces informations.", 403);
}