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
$firstName = $_POST["first_name"];
$lastName = $_POST["last_name"];
$email = $_POST["email"];
$password = $_POST["password"];
$confirmationPassword = $_POST["confirmation_password"];

// Vérification des champs de la requête
if(!isset($firstName) or !isset($lastName) or !isset($email) or !isset($password) or !isset($confirmationPassword)) {
    $dataSet = [
        "contentError" => true,
        "errorMessage" => "Un champ n'a pas été rempli",
    ];
    dieInSuccess($dataSet);
}
if($password != $confirmationPassword) {
    $dataPass = [
        "contentError" => true,
        "errorMessage" => "Les mots de passes ne correspondent pas",
    ];
    dieInSuccess($dataPass);
}
if(!preg_match("/^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/i", $email)) {
    $dataEmail = [
        "contentError" => true,
        "errorMessage" => "L'adresse email n'est pas valide",
    ];
    dieInSuccess($dataEmail);
}

// connection à la DB
$pdo = connect_db();

// Nous vérifions si l'utilisteur existe déjà
$queryEmail = "SELECT email FROM " . MYSQL_SCHEMA . ".users where email = :email LIMIT 1";
$value = [":email" => $email];

// Nous exécutons la requête
try {
    $res = $pdo->prepare($queryEmail);
    $res->execute($value);
} catch (PDOException $e) {
    dieInError("Erreur de requête dans la BD: " . $e->getMessage());
}

// Nous récupérons le premier résultat. S'il n'y a aucun résultat, `$row` sera `null`
$row = $res->fetch(PDO::FETCH_ASSOC);

if (is_array($row)) {
    $dataEmailExist = [
        "contentError" => true,
        "errorMessage" => "L'adresse email existe déjà",
    ];
    dieInSuccess($dataEmailExist);
} else {
    // Variables qui contiendront la requête (en texte) et les variables à y insérer
    $query = "INSERT INTO " . MYSQL_SCHEMA . ".users (email, password, nb_game, score, first_name, last_name)
            VALUES (:email, :password, 0, 0.000, :first_name, :last_name)";
    $values = [
        ":first_name" => $firstName,
        ":last_name" => $lastName,
        ":email" => $email,
        ":password" => hash('sha256', $password),
        ];

// Nous exécutons la requête
    try {
        $res = $pdo->prepare($query);
        $res->execute($values);
    } catch (PDOException $e) {
        dieInError("Erreur de requête dans la BD: " . $e->getMessage());
    }

    $id = $pdo->lastInsertId();

    $data = [
        "messageSuccess" => "L'utilisateur est bien enregistré.",
    ];
    $_SESSION["connected"] = true;
    $_SESSION["id_user"] = $id;
    dieInSuccess($data);
}

