<?php

include "utilities.php";

session_start();

header('Content-Type: application/json');

$method = $_SERVER["REQUEST_METHOD"];

if (isset($_SESSION["connected"]) && $_SESSION["connected"] === true) {
    // Si l'utilisateur est connecté, il a accès à ces informations
    if ($method !== "POST") {
        renderError("La méthode $method n'est pas acceptée", 405);
    }

    // Récupération des champs de la requête
    $data = $_POST["tab_data"];
    $mot = $_POST["mot"];

    // Mise à jour des données
    $data = array_values(array_unique($data));
    $tab_data = implode(",", $data);

    // connection à la BD
    $pdo = connect_db();
    $query = "SELECT target, msg FROM " . MYSQL_SCHEMA . ".usf_fan WHERE cue = :mot AND find_in_set(target, :tab_data)";
    $valuesWords = [":mot" => $mot, ":tab_data" => $tab_data];

    // Nous exécutons la requête
    try {
        $res = $pdo->prepare($query);
        $res->execute($valuesWords);
    } catch (PDOException $e) {
        dieInError("Erreur de requête dans la BD: " . $e->getMessage());
    }

    $out["output"] = $res->fetchAll(PDO::FETCH_GROUP);
    $out["data"] = $data;
    $out["mot"] = $mot;

    // Mise à jour des scores
    $id = (int) $_SESSION["id_user"];
    $score = 0.0;
    foreach ($out["output"] as $datum) {
        $score += $datum[0]["msg"];
    }
    $out["score"] = $score;

    $updateProfile = "UPDATE " . MYSQL_SCHEMA . ".users SET nb_game = (nb_game + 1), score = CASE WHEN score < :score THEN :score ELSE score END WHERE id = :id";

    // Nous exécutons la requête
    try {
        $res = $pdo->prepare($updateProfile);
        $res->bindParam(':id', $id, PDO::PARAM_INT);
        $res->bindParam(':score', $score);
        $res->execute();
    } catch (PDOException $e) {
        dieInError("Erreur de requête dans la BD: " . $e->getMessage());
    }

    echo json_encode($out);
    die();
} else {
    // Sinon il ne peut pas avoir accès à ces informaions
    renderError("Vous devez vous connecter pour avoir accès à ces informations.", 403);
}