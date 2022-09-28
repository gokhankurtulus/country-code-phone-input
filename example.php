<?php
$countryCode = "90";
$business = "(111) 111 - 1111";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Phone Input</title>
    <link rel="stylesheet" href="country-code-phone-input-ui.css">
    <link rel="stylesheet" href="flags.css">
    <!-- Example form styles, you don't need to use them -->
    <style>
        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }

        .example_container {
            height: 100vh;
            width: 100vw;
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
        }

        form {
            display: flex;
            flex-flow: column nowrap;
            gap: .5rem;
        }

        input {
            width: 100%;
            flex: 1;
            padding: 0.5rem;
            outline: none;
            border-radius: 5px;
            font-size: 1rem;
            border: 1px solid #CCCCCC;
            background: #FFF;
            transition: .2s;
        }

        input[type="submit"] {
            cursor: pointer;
            background: #3995DB;
            color: #FFF;
        }
    </style>
</head>
<body>
<div class="example_container">
    <?php
    if (isset($_POST['mobile-number'])) {
        echo '<pre>';
        var_dump($_POST);
        echo '</pre>';
    }
    ?>
    <form method="post">
        <input type="text" name="name" placeholder="name" value="Gökhan">
        <input type="text" name="lastname" placeholder="lastname" value="Kurtuluş">
        <input type="text" name="mobile-number_country_code" value="<?= $countryCode; ?>">
        <input type="tel" id="mobile-number" name="mobile-number" placeholder="mobile" value="<?= $business; ?>">
        <input type="tel" id="business-number" name="business-number" placeholder="business" value="">
        <input type="text" name="address" value="" placeholder="address">
        <input type="submit" value="Send">
    </form>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
<script src="country-code-phone-input.js"></script>
<script>
    phoneInput('mobile-number');
    phoneInput('business-number');
</script>
</body>
</html>