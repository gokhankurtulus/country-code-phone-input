<?php
if (isset($_POST['mobile-number']))
    var_dump($_POST);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="country-code-phone-input-ui.css">
    <link rel="stylesheet" href="flags.css">
    <style>
    </style>
</head>
<body>
<form method="post">
    <input type="text" name="name" placeholder="name" value="">
    <input type="text" name="lastname" placeholder="lastname" value="">
    <input type="tel" id="mobile-number" name="mobile-number" placeholder="mobile">
    <input type="tel" id="business-number" name="business-number" placeholder="business">
    <input type="text" name="address" value="" placeholder="address">
    <button type="submit">send</button>
</form>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
<script src="country-code-phone-input.js"></script>
<script>
    phoneInput('mobile-number');
    phoneInput('business-number');
</script>
</body>
</html>