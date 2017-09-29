$(() => {
    $.get('../clients.xml', xmlData => {
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
});
