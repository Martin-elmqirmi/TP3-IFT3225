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

    $word = "";
    $output = "table";

    if (isset($_GET["word"])) {
        $word = $_GET["word"];
    }
    if (isset($_GET["output"])) {
        $output = $_GET["output"];
    }

    $pdo = connect_db();
    $query = "SELECT * FROM " . MYSQL_SCHEMA . ".usf_fan WHERE cue = :word ORDER BY msg DESC";
    $valueWord = [":word" => $word];

    // Nous exécutons la requête
    try {
        $res = $pdo->prepare($query);
        $res->execute($valueWord);
    } catch (PDOException $e) {
        dieInError("Erreur de requête dans la BD: " . $e->getMessage());
    }

    $data = $res->fetchAll();
    $out["output"] = $output;
    $out["data"] = $data;
    echo json_encode($out);
    die();
} else {
    // Sinon il ne peut pas avoir accès à ces informaions
    renderError("Vous devez vous connecter pour avoir accès à ces informations.", 403);
}