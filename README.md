# country-code-phone-input

<ul>
    <li>Requires jQuery</li>
    <li>Country list taken from https://countrycode.org/, there may be discrepancies or omissions, data accuracy has not been tested.</li>
    <li>Country flag sprite taken from https://flag-sprites.com/, there may be discrepancies or omissions, data accuracy has not been tested.</li>
</ul>

## Usage
```html
<link rel="stylesheet" href="country-code-phone-input-ui.css">
<link rel="stylesheet" href="flags.css">
```
```html
<input type="tel" id="mobile-number" name="mobile-number" placeholder="mobile">
```
<p>or if you want to give value</p>
<h4>Warning!: Different flags may appear due to countries using the same code which is given.</h4>
<p>e.g. country code of Canada and USA is 1. </p>

```html
<input type="text" name="mobile-number_country_code" value="90"> <!-- This will allow you to enter code value -->
<input type="tel" id="mobile-number" name="mobile-number" placeholder="mobile" value="(111) 111 - 1111">
```

```html
<script src="jquery.js"></script>
<script src="country-code-phone-input.js"></script>
<script>
    phoneInput('xxxxx'); // Input ID
</script>
```

<p>Optional Settings on: country-code-phone-input.js </p>

```html
const countryCodePlusSign = true;
const defaultCode = "1";
const defaultFlag = "flag-us";
```
