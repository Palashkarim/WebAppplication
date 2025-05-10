<?php
require 'config.php';

function registerUser($username, $email, $password, $user_type, $full_name) {
    global $pdo;
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, user_type, full_name) VALUES (?, ?, ?, ?, ?)");
    return $stmt->execute([$username, $email, $hashed_password, $user_type, $full_name]);
}

function loginUser($username, $password) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['user_type'] = $user['user_type'];
        $_SESSION['full_name'] = $user['full_name'];
        return true;
    }
    return false;
}

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function getUserType() {
    return $_SESSION['user_type'] ?? null;
}

function logout() {
    session_unset();
    session_destroy();
}
?>