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

    $limit = 50;
    $offset = 0;

    if (isset($_GET["offset"])) {
        $offset = $_GET["offset"];
    }
    if (isset($_GET["limit"])) {
        $limit = $_GET["limit"];
    }

    $pdo = connect_db();
    $query = "SELECT DISTINCT cue FROM " . MYSQL_SCHEMA . ".usf_fan LIMIT :offset, :limit";

    // Nous exécutons la requête
    try {
        $res = $pdo->prepare($query);
        $res->bindParam(':offset', $offset, PDO::PARAM_INT);
        $res->bindParam(':limit', $limit, PDO::PARAM_INT);
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