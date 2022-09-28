const countryCodePlusSign = true;
const defaultCode = "1";
const defaultFlag = "flag-us";

function phoneInput(input_id) {
    let input = $('#' + input_id)[0];
    // if input doesn't exist won't do anything
    if ($(input).length) {
        let inputParent = $(input).parent()[0];
        let inputIndex = $(input).index();

        //create inputcontainer for wrap all fields
        let inputContainer = document.createElement('div');
        inputContainer.classList.add("phone__input");
        //insert created container to input's index to prevent displacement
        inputParent.insertBefore(inputContainer, inputParent.children[inputIndex]);

        // country code input's name is given input name + _country_code
        let countryCodeInputName = $(input).attr("name") + '_country_code';

        // check country code input is given
        let countryCodeInput = $('input[name="' + countryCodeInputName + '"]')[0];
        if ($(countryCodeInput).length) {
            createCountryCodeWithoutInput(inputContainer);
            changeFlagByCountryCode(inputContainer, countryCodeInput);
        } else {
            createCountryCodePart(inputContainer, countryCodeInputName);
        }

        createCountryListPart(inputContainer);
        let countryListElement = $(inputContainer).find(".country__list")[0];
        createCountryListItems(countryListElement);

        //finally put input to container
        $(input).appendTo(inputContainer);
        $(input).keypress(function (e) {
            blockNonDigitChars();
        });
    }
}


$(document).ready(function () {
    closeCountryLists();
    /* If user clicks document close all lists, we'll prevent closing when clicking the inside fields with e.stopPropagation() */
    $(document).click(function (e) {
        closeCountryLists();
    });
    /* Opens country list when click on the county code part and focuses on the search input */
    $(".country__code").on('click', function (e) {
        closeCountryLists();
        e.stopPropagation();
        let inputParent = $(this).parent()[0];
        let countryListElement = $(inputParent).find(".country__list")[0];
        $(countryListElement).show();
        $(countryListElement).find(".search__on__list").focus();
    });
    $(".country__code").on('keypress', function (e) {
        if (e.which === 13) {
            event.preventDefault();
            closeCountryLists();
            e.stopPropagation();
            let inputParent = $(this).parent()[0];
            let countryListElement = $(inputParent).find(".country__list")[0];
            $(countryListElement).show();
            $(countryListElement).find(".search__on__list").focus();
        }
    });
    $(".search__on__list").on('click', function (e) {
        e.stopPropagation();
    });
    $(".search__on__list").on('input', function (e) {
        searchItemOnCountryList(this);
    });
    $(".country__list__item").on('click', function (e) {
        let inputParent = $(this).closest(".phone__input")[0];
        let countryCodeInput = $(inputParent).find(".country__code__input")[0];
        let selectedFlag = $(inputParent).find(".selected__flag .fg")[0];
        $(selectedFlag).attr("class", "fg flag " + $(this).attr('data-country-flag'));

        let countryCodeValue = $(this).attr('data-country-code').replace('+', '');
        if (countryCodePlusSign)
            $(countryCodeInput).val("+" + countryCodeValue);
        else
            $(countryCodeInput).val(countryCodeValue);
    });
});

function changeFlagByCountryCode(inputContainer, countryCodeInput) {
    let foundedIndex = -1;
    let countryCodeElement = $(inputContainer).find(".country__code")[0];
    let countryCodeValue = $(countryCodeInput).val();
    let selectedFlagElement = $(countryCodeElement).find(".selected__flag .flag")[0];
    countryCodeValue = countryCodeValue.replace('+', '');
    if (countryCodeValue) {
        $.each(countries, function (i, field) {
            if (field['code'] === countryCodeValue) {
                foundedIndex = i;
                return false;
            }
        });
        if (foundedIndex !== -1) {
            let flag = '';
            if (countries[foundedIndex])
                flag = countries[foundedIndex]['flag'];

            $(selectedFlagElement).removeClass().addClass("fg flag " + flag);
            if (countryCodePlusSign)
                $(countryCodeInput).val("+" + countryCodeValue);
            else
                $(countryCodeInput).val(countryCodeValue);
        } else {
            $(selectedFlagElement).removeClass().addClass("fg ");
        }
    } else {
        $(selectedFlagElement).removeClass().addClass("fg ");
    }
    countryCodeInput.classList.add("country__code__input");
    $(countryCodeInput).appendTo(countryCodeElement);
}

const CountryCodeTemplate = ({input_name, plus_sign, default_code, default_flag}) => `
        <div class="country__code">
            <div class="selected__flag">
                <div class="fg flag ${default_flag}"></div>
            </div>
            <input type="text" class="country__code__input" name="${input_name}" readonly value="${plus_sign}${default_code}">
        </div>
`;
const CountryCodeWithoutInput = ({default_flag}) => `
        <div class="country__code">
            <div class="selected__flag">
                <div class="fg flag ${default_flag}"></div>
            </div>
        </div>
`;

/* Appends country code template to container */
function createCountryCodePart(inputContainer, countryCodeInputName) {
    let plusSign = "+";
    if (!countryCodePlusSign)
        plusSign = "";
    $(inputContainer).append([
        {input_name: countryCodeInputName, plus_sign: plusSign, default_code: defaultCode, default_flag: defaultFlag},
    ].map(CountryCodeTemplate).join(''));
}

function createCountryCodeWithoutInput(inputContainer) {
    $(inputContainer).append([
        {default_flag: defaultFlag},
    ].map(CountryCodeWithoutInput).join(''));
}

const CountryListTemplate = () => `
        <ul class="country__list">
        <li class="country__search__container"><input class="search__on__list"></li>
        </ul>
`;

/* Creates and append country list template to container */
function createCountryListPart(inputContainer) {
    $(inputContainer).append([
        {},
    ].map(CountryListTemplate).join(''));
}

const CountryListItemTemplate = ({flag, name, code}) => `
            <li class="country__list__item" data-country-code="+${code}" data-country-flag="${flag}">
                <div class="flag ${flag}"></div>
                <div class="country-name">${name}</div>
                <div class="country-code">+${code}</div>
            </li>
`;

/* Creates and append each country items to country list*/
function createCountryListItems(countryList) {
    $.each(countries, function (i, field) {
        $(countryList).append([
            {flag: field['flag'], name: field['name'], code: field['code']},
        ].map(CountryListItemTemplate).join(''));
    });
}

function blockNonDigitChars() {
    let regex = new RegExp("^[0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

    if (!regex.test(key) && event.keyCode !== 13) {
        event.preventDefault();
        return false;
    }
}


// search inside country list
function searchItemOnCountryList(elem) {
    if ($(elem).length) {
        let searchText = $(elem).val();
        let elements = $(elem).closest(".country__list").find(".country__list__item");
        searchText = searchText.toLowerCase();

        $.each(elements, function (index, item) {
            if (!item.innerHTML.toLowerCase().includes(searchText)) {
                item.style.display = "none";
            } else {
                item.style.display = "flex";
            }
        });
    }
}

function clearSearchOnCountryListInputs() {
    let elements = $('.search__on__list');
    $.each(elements, function (index, item) {
        $(item).val('');
    });
}

function showAllCountryListItems() {
    let elements = $('.country__list__item');
    $.each(elements, function (index, item) {
        item.style.display = "flex";
    });
}

function closeCountryLists() {
    let countryList = $(".country__list");
    if (countryList.length)
        countryList.hide();
    showAllCountryListItems();
    clearSearchOnCountryListInputs();
}

// from https://countrycode.org/
const countries = [
    {name: "Algeria", code: "213", flag: "flag-dz"},
    {name: "Andorra", code: "376", flag: "flag-ad"},
    {name: "Angola", code: "244", flag: "flag-ao"},
    {name: "Anguilla", code: "1264", flag: "flag-ai"},
    {name: "Antigua & Barbuda", code: "1268", flag: "flag-ag"},
    {name: "Argentina", code: "54", flag: "flag-ar"},
    {name: "Armenia", code: "374", flag: "flag-am"},
    {name: "Aruba", code: "297", flag: "flag-aw"},
    {name: "Australia", code: "61", flag: "flag-au"},
    {name: "Austria", code: "43", flag: "flag-at"},
    {name: "Azerbaijan", code: "994", flag: "flag-az"},
    {name: "Bahamas", code: "1242", flag: "flag-bs"},
    {name: "Bahrain", code: "973", flag: "flag-bh"},
    {name: "Bangladesh", code: "880", flag: "flag-bd"},
    {name: "Barbados", code: "1246", flag: "flag-bb"},
    {name: "Belarus", code: "375", flag: "flag-by"},
    {name: "Belgium", code: "32", flag: "flag-be"},
    {name: "Belize", code: "501", flag: "flag-bz"},
    {name: "Benin", code: "229", flag: "flag-bj"},
    {name: "Bermuda", code: "1441", flag: "flag-bm"},
    {name: "Bhutan", code: "975", flag: "flag-bt"},
    {name: "Bolivia", code: "591", flag: "flag-bo"},
    {name: "Bosnia Herzegovina", code: "387", flag: "flag-ba"},
    {name: "Botswana", code: "267", flag: "flag-bw"},
    {name: "Brazil", code: "55", flag: "flag-br"},
    {name: "Brunei", code: "673", flag: "flag-bn"},
    {name: "Bulgaria", code: "359", flag: "flag-bg"},
    {name: "Burkina Faso", code: "226", flag: "flag-bf"},
    {name: "Burundi", code: "257", flag: "flag-bi"},
    {name: "Cambodia", code: "855", flag: "flag-kh"},
    {name: "Cameroon", code: "237", flag: "flag-cm"},
    {name: "Canada", code: "1", flag: "flag-ca"},
    {name: "Cape Verde", code: "238", flag: "flag-cv"},
    {name: "Cayman Islands", code: "1345", flag: "flag-ky"},
    {name: "Central African Republic", code: "236", flag: "flag-cf"},
    {name: "Chile", code: "56", flag: "flag-cl"},
    {name: "China", code: "86", flag: "flag-cn"},
    {name: "Colombia", code: "57", flag: "flag-co"},
    {name: "Comoros", code: "269", flag: "flag-km"},
    {name: "Cook Islands", code: "682", flag: "flag-ck"},
    {name: "Costa Rica", code: "506", flag: "flag-cr"},
    {name: "Croatia", code: "385", flag: "flag-hr"},
    {name: "Cuba", code: "53", flag: "flag-cu"},
    {name: "Cyprus", code: "357", flag: "flag-cy"},
    {name: "Czech Republic", code: "42", flag: "flag-cz"},
    {name: "Denmark", code: "45", flag: "flag-dk"},
    {name: "Djibouti", code: "253", flag: "flag-dj"},
    {name: "Dominica", code: "1767", flag: "flag-dm"},
    {name: "Dominican Republic", code: "1809", flag: "flag-do"},
    {name: "Dominican Republic", code: "1829", flag: "flag-do"},
    {name: "Dominican Republic", code: "1849", flag: "flag-do"},
    {name: "Ecuador", code: "593", flag: "flag-ec"},
    {name: "Egypt", code: "20", flag: "flag-eg"},
    {name: "El Salvador", code: "503", flag: "flag-sv"},
    {name: "Equatorial Guinea", code: "240", flag: "flag-gq"},
    {name: "Eritrea", code: "291", flag: "flag-er"},
    {name: "Estonia", code: "372", flag: "flag-ee"},
    {name: "Ethiopia", code: "251", flag: "flag-et"},
    {name: "Falkland Islands", code: "500", flag: "flag-fk"},
    {name: "Faroe Islands", code: "298", flag: "flag-fo"},
    {name: "Fiji", code: "679", flag: "flag-fj"},
    {name: "Finland", code: "358", flag: "flag-fi"},
    {name: "France", code: "33", flag: "flag-fr"},
    {name: "French Polynesia", code: "689", flag: "flag-pf"},
    {name: "Gabon", code: "241", flag: "flag-ga"},
    {name: "Gambia", code: "220", flag: "flag-gm"},
    {name: "Georgia", code: "7880", flag: "flag-ge"},
    {name: "Germany", code: "49", flag: "flag-de"},
    {name: "Ghana", code: "233", flag: "flag-gh"},
    {name: "Gibraltar", code: "350", flag: "flag-gi"},
    {name: "Greece", code: "30", flag: "flag-gr"},
    {name: "Greenland", code: "299", flag: "flag-gl"},
    {name: "Grenada", code: "1473", flag: "flag-gd"},
    {name: "Guam", code: "1671", flag: "flag-gu"},
    {name: "Guatemala", code: "502", flag: "flag-gt"},
    {name: "Guinea", code: "224", flag: "flag-gn"},
    {name: "Guinea-Bissau", code: "245", flag: "flag-gw"},
    {name: "Guyana", code: "592", flag: "flag-gy"},
    {name: "Haiti", code: "509", flag: "flag-ht"},
    {name: "Honduras", code: "504", flag: "flag-hn"},
    {name: "Hong Kong", code: "852", flag: "flag-hk"},
    {name: "Hungary", code: "36", flag: "flag-hu"},
    {name: "Iceland", code: "354", flag: "flag-is"},
    {name: "India", code: "91", flag: "flag-in"},
    {name: "Indonesia", code: "62", flag: "flag-id"},
    {name: "Iran", code: "98", flag: "flag-ir"},
    {name: "Iraq", code: "964", flag: "flag-iq"},
    {name: "Ireland", code: "353", flag: "flag-ie"},
    {name: "Israel", code: "972", flag: "flag-il"},
    {name: "Italy", code: "39", flag: "flag-it"},
    {name: "Jamaica", code: "1876", flag: "flag-jm"},
    {name: "Japan", code: "81", flag: "flag-jp"},
    {name: "Jordan", code: "962", flag: "flag-jo"},
    {name: "Kazakhstan", code: "7", flag: "flag-kz"},
    {name: "Kenya", code: "254", flag: "flag-ke"},
    {name: "Kiribati", code: "686", flag: "flag-ki"},
    {name: "Korea North", code: "850", flag: "flag-kp"},
    {name: "Korea South", code: "82", flag: "flag-kr"},
    {name: "Kuwait", code: "965", flag: "flag-kw"},
    {name: "Kyrgyzstan", code: "996", flag: "flag-kg"},
    {name: "Laos", code: "856", flag: "flag-la"},
    {name: "Latvia", code: "371", flag: "flag-lv"},
    {name: "Lebanon", code: "961", flag: "flag-lb"},
    {name: "Lesotho", code: "266", flag: "flag-ls"},
    {name: "Liberia", code: "231", flag: "flag-lr"},
    {name: "Libya", code: "218", flag: "flag-ly"},
    {name: "Liechtenstein", code: "423", flag: "flag-li"},
    {name: "Lithuania", code: "370", flag: "flag-lt"},
    {name: "Luxembourg", code: "352", flag: "flag-lu"},
    {name: "Macao", code: "853", flag: "flag-mo"},
    {name: "Macedonia", code: "389", flag: "flag-mk"},
    {name: "Madagascar", code: "261", flag: "flag-mg"},
    {name: "Malawi", code: "265", flag: "flag-mw"},
    {name: "Malaysia", code: "60", flag: "flag-my"},
    {name: "Maldives", code: "960", flag: "flag-mv"},
    {name: "Mali", code: "223", flag: "flag-ml"},
    {name: "Malta", code: "356", flag: "flag-mt"},
    {name: "Marshall Islands", code: "692", flag: "flag-mh"},
    {name: "Mauritania", code: "222", flag: "flag-mr"},
    {name: "Mayotte", code: "262", flag: "flag-yt"},
    {name: "Mexico", code: "52", flag: "flag-mx"},
    {name: "Micronesia", code: "691", flag: "flag-fm"},
    {name: "Moldova", code: "373", flag: "flag-md"},
    {name: "Monaco", code: "377", flag: "flag-mc"},
    {name: "Mongolia", code: "976", flag: "flag-mn"},
    {name: "Montserrat", code: "1664", flag: "flag-ms"},
    {name: "Morocco", code: "212", flag: "flag-ma"},
    {name: "Mozambique", code: "258", flag: "flag-mz"},
    {name: "Myanmar", code: "95", flag: "flag-mm"},
    {name: "Namibia", code: "264", flag: "flag-na"},
    {name: "Nauru", code: "674", flag: "flag-nr"},
    {name: "Nepal", code: "977", flag: "flag-np"},
    {name: "Netherlands", code: "31", flag: "flag-nl"},
    {name: "New Caledonia", code: "687", flag: "flag-nc"},
    {name: "New Zealand", code: "64", flag: "flag-nz"},
    {name: "Nicaragua", code: "505", flag: "flag-ni"},
    {name: "Niger", code: "227", flag: "flag-ne"},
    {name: "Nigeria", code: "234", flag: "flag-ng"},
    {name: "Niue", code: "683", flag: "flag-nu"},
    {name: "Northern Mariana Islands", code: "670", flag: "flag-mp"},
    {name: "Norway", code: "47", flag: "flag-no"},
    {name: "Oman", code: "968", flag: "flag-om"},
    {name: "Pakistan", code: "92", flag: "flag-pk"},
    {name: "Palau", code: "680", flag: "flag-pw"},
    {name: "Palestine", code: "970", flag: "flag-ps"},
    {name: "Panama", code: "507", flag: "flag-pa"},
    {name: "Papua New Guinea", code: "675", flag: "flag-pg"},
    {name: "Paraguay", code: "595", flag: "flag-py"},
    {name: "Peru", code: "51", flag: "flag-pe"},
    {name: "Philippines", code: "63", flag: "flag-ph"},
    {name: "Poland", code: "48", flag: "flag-pl"},
    {name: "Portugal", code: "351", flag: "flag-pt"},
    {name: "Puerto Rico", code: "1787", flag: "flag-pr"},
    {name: "Puerto Rico", code: "1939", flag: "flag-pr"},
    {name: "Qatar", code: "974", flag: "flag-qa"},
    {name: "Republic of the Congo", code: "242", flag: "flag-cg"},
    {name: "Reunion", code: "262", flag: "flag-re"},
    {name: "Romania", code: "40", flag: "flag-ro"},
    {name: "Russia", code: "7", flag: "flag-ru"},
    {name: "Rwanda", code: "250", flag: "flag-rw"},
    {name: "Saint Helena", code: "290", flag: "flag-sh"},
    {name: "Saint Kitts", code: "1869", flag: "flag-kn"},
    {name: "Saint Lucia", code: "1758", flag: "flag-lc"},
    {name: "San Marino", code: "378", flag: "flag-sm"},
    {name: "Sao Tome & Principe", code: "239", flag: "flag-st"},
    {name: "Saudi Arabia", code: "966", flag: "flag-sa"},
    {name: "Senegal", code: "221", flag: "flag-sn"},
    {name: "Serbia", code: "381", flag: "flag-rs"},
    {name: "Seychelles", code: "248", flag: "flag-sc"},
    {name: "Sierra Leone", code: "232", flag: "flag-sl"},
    {name: "Singapore", code: "65", flag: "flag-sg"},
    {name: "Slovakia", code: "421", flag: "flag-sk"},
    {name: "Slovenia", code: "386", flag: "flag-si"},
    {name: "Solomon Islands", code: "677", flag: "flag-sb"},
    {name: "Somalia", code: "252", flag: "flag-so"},
    {name: "South Africa", code: "27", flag: "flag-za"},
    {name: "Spain", code: "34", flag: "flag-es"},
    {name: "Sri Lanka", code: "94", flag: "flag-lk"},
    {name: "Sudan", code: "249", flag: "flag-sd"},
    {name: "Suriname", code: "597", flag: "flag-sr"},
    {name: "Swaziland", code: "268", flag: "flag-sz"},
    {name: "Sweden", code: "46", flag: "flag-se"},
    {name: "Switzerland", code: "41", flag: "flag-ch"},
    {name: "Syria", code: "963", flag: "flag-sy"},
    {name: "Taiwan", code: "886", flag: "flag-tw"},
    {name: "Tajikstan", code: "992", flag: "flag-tj"},
    {name: "Tanzania", code: "255", flag: "flag-tz"},
    {name: "Thailand", code: "66", flag: "flag-th"},
    {name: "Togo", code: "228", flag: "flag-tg"},
    {name: "Tonga", code: "676", flag: "flag-to"},
    {name: "Trinidad & Tobago", code: "1868", flag: "flag-tt"},
    {name: "Tunisia", code: "216", flag: "flag-tn"},
    {name: "Turkey", code: "90", flag: "flag-tr"},
    {name: "Turkmenistan", code: "993", flag: "flag-tm"},
    {name: "Turks and Caicos Islands", code: "1649", flag: "flag-tc"},
    {name: "Tuvalu", code: "688", flag: "flag-tv"},
    {name: "Uganda", code: "256", flag: "flag-ug"},
    {name: "Ukraine", code: "380", flag: "flag-ua"},
    {name: "United Arab Emirates", code: "971", flag: "flag-ae"},
    {name: "United Kingdom", code: "44", flag: "flag-uk"},
    {name: "United States", code: "1", flag: "flag-us"},
    {name: "Uruguay", code: "598", flag: "flag-uy"},
    {name: "Uzbekistan", code: "998", flag: "flag-uz"},
    {name: "Vanuatu", code: "678", flag: "flag-vu"},
    {name: "Vatican", code: "379", flag: "flag-va"},
    {name: "Venezuela", code: "58", flag: "flag-ve"},
    {name: "Vietnam", code: "84", flag: "flag-vn"},
    {name: "Wallis & Futuna", code: "681", flag: "flag-wf"},
    {name: "Yemen", code: "967", flag: "flag-ye"},
    {name: "Zambia", code: "260", flag: "flag-zm"},
    {name: "Zimbabwe", code: "263", flag: "flag-zw"}
];