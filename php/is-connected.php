<?php

session_start();

header('Content-Type: application/json');

if (isset($_SESSION["connected"]) && $_SESSION["connected"] === true) {
    echo "true";
} else {
    echo "false";
}
