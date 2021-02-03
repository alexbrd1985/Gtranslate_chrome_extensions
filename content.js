var text = '';
var id, i, temp_strings;

jQuery('textarea[data-drupal-selector^="edit-strings"]').one("click", function () {
    if (jQuery(this).css('color') == "rgb(89, 89, 89)" || !jQuery(this).val()) {
        const id = jQuery(this).attr('data-drupal-selector').match(/^edit-strings-(\d+)-translations/)[1];
        let text = jQuery("div[id^='edit-strings-" + id + "']").text().replace('Chaîne de caractères source (Anglais intégré)', '').trim();

        let i = 0;
        const REG_STR = /<[^<>]+>|[a-zA-Z_\d]*@[a-zA-Z_\d-]*|\{\{[^<{}>]*\}\}|\[[^\[\]]*\]|%[a-zA-Z_\d-]*|&[a-zA-Z\d]*;/g;
        temp_strings = text.match(REG_STR);
        text = text.replace(REG_STR, function () {
            i++;
            return '[' + (i - 1) + ']';
        });

        let url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + 'en' + "&tl=" + 'fr' + "&dt=t&q=" + encodeURI(text);
        text = '';

        let target_areatext = jQuery(this);

        jQuery.ajax({
            url: url,
            success: function (data) {
                data[0].forEach(function (element) {
                    text = text + element[0];
                });

                text = text.replace(/\[(\d)+\]/g, function (e) {
                    let temp_id = e.match((/\[(\d)+\]/))[1];
                    return temp_strings[temp_id]
                });

                target_areatext.val(text).css({'color': 'green'});
            },
            dataType: "json"
        });
    }
});
