$(() => {
    $.get('./clients.xml', xmlData => {
        /* GETs the clients.xml file, then parses the clients to polulate
        the client selector dropdown list. Sort the options text values prior
        to appending them to the dropdown list. */
        const clients = xmlData.querySelectorAll('client');
        const clientSelector = $('#clientSelection');
        let optionTags = [];

        clients.forEach(client => {
            const optionTag = document.createElement('option');
            optionTag.value = client.querySelector('id').innerHTML;
            optionTag.text = $(client).find('clientName').text();

            optionTags.push(optionTag);
        });

        optionTags.sort((tag1, tag2) => {
            // TODO: Reduce to only one return statement.
            if(tag1.text.toLowerCase() < tag2.text.toLowerCase()) {
                return -1;
            }

            if(tag1.text.toLowerCase() > tag2.text.toLowerCase()) {
                return 1;
            }

            return 0;
        });

        optionTags.forEach(optionTag => {
            clientSelector.append(optionTag);
        });
    });

    $('#clientSelection').change(() => {
        const selectedValue = $('#clientSelection').val();
        const invoiceFile =
            (parseInt(selectedValue) === 1)
            // There is no file `invoice1.xml`, so assuming invoice.xml is the
            // usual pattern for clients with the ID 1.
                ? './invoice.xml'
                : `./invoice${selectedValue}.xml`;

        $.get(invoiceFile, xmlData => {
            console.log(xmlData);
        });
    });
});
