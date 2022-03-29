<?php

include "utilities.php";

session_start();

$_SESSION["connected"] = false;

header('Content-Type: application/json');

// C'est une erreur d'appeler ce script autrement que par POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    dieInError("Vous devez appeler ce script avec POST");
}

// Récupération des champs de la requête
$email = $_POST["email"];
$password = $_POST["password"];

// Connection à la base de données
$pdo = connect_db();

// Variables qui contiendront la requête (en texte) et les variables à y insérer
$query = "SELECT id, email FROM " . MYSQL_SCHEMA . ".users where email = :email and password = :password LIMIT 1";
$values = [":email" => $email, ":password" => hash('sha256', $password)];

// Nous exécutons la requête
try {
    $res = $pdo->prepare($query);
    $res->execute($values);
} catch (PDOException $e) {
    dieInError("Erreur de requête dans la BD: " . $e->getMessage());
}

// Nous récupérons le premier résultat. S'il n'y a aucun résultat, `$row` sera `null`
$row = $res->fetch(PDO::FETCH_ASSOC);

if (is_array($row)) {
    $data = [
        "found" => true,
    ];
    $_SESSION["connected"] = true;
    $_SESSION["id_user"] = $row["id"];
    dieInSuccess($data);
} else {
    $data = [
        "found" => false,
    ];
    dieInSuccess($data);
}


