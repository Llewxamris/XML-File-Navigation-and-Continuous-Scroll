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

        $.get(invoiceFile, invoiceData => {
            const clientInvoiceElement = $('#clientInvoiceData');
            // XXX const clientInformation = $(invoiceData).find('client');
            // TODO: Parse through contact information without hardcoding the
            // tag names, prevents errors if the invoice.xsd file changes.
            // TODO: Currently just dumps text to screen, must format data.

            clientInvoiceElement.text('');
            clientInvoiceElement.append($(invoiceData).find('contactFirstName')
                .text() + ' ');
            clientInvoiceElement.append($(invoiceData).find('contactLastName')
                .text());
            clientInvoiceElement.append($(invoiceData).find('clientStreet')
                .text());
            clientInvoiceElement.append($(invoiceData).find('clientCity')
                .text() + ', ');
            clientInvoiceElement.append($(invoiceData).find('clientProvince')
                .text());
            clientInvoiceElement.append($(invoiceData).find('clientPostalCode')
                .text());
            clientInvoiceElement.append($(invoiceData).find('clientDiscount')
                .text());
            clientInvoiceElement.append($(invoiceData).find('info')
                .attr('invoiceNumber'));
            clientInvoiceElement.append($(invoiceData).find('invoiceDate')
                .text());
            clientInvoiceElement.append($(invoiceData).find('billRate')
                .text());

        });
    });
});
