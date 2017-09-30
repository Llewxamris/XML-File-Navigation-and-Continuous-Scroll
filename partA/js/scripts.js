$(() => {
    let index = 0;
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
            const workRecords = invoiceData.querySelectorAll('workRecord');
            let workRecArray = [];
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

            workRecords.forEach(workRecord => {
                workRecArray.push(workRecord);
            });
            workRecArray.sort((record1, record2) => {
                // TODO: Reduce to only one return statement.
                if(parseInt($(record1).attr('workNumber')) <
                    $(record2).attr('workNumber')) {
                    return -1;
                }

                if(parseInt($(record1).attr('workNumber')) >
                    parseInt($(record2).attr('workNumber'))) {
                    return 1;
                }

                return 0;
            });

            let workRecordDiv = document.createElement('div');
            workRecordDiv.id = 'workRecords';
            const workRecordButtonsDiv = document.createElement('div');
            const nextButton = document.createElement('input');
            const prevButton = document.createElement('input');
            const searchBox = document.createElement('input');
            const searchButton = document.createElement('input');

            const displayWorkRecord = (workRecElmnt, workRecNum, workRecs) => {
                const workRecord = workRecs[workRecNum];
                workRecElmnt.text('');
                workRecElmnt.append($(workRecord).find('workDescription')
                    .text());
            };

            const checkButtonsForDisabling = (nextBtn, prevBtn, arraySize) => {
                if (index === arraySize - 1) {
                    nextBtn.prop('disabled', true);
                } else {
                    nextBtn.prop('disabled', false);
                }

                if (index === 0) {
                    prevBtn.prop('disabled', true);
                } else {
                    prevBtn.prop('disabled', false);
                }
            };

            prevButton.id = 'btnPrev';
            prevButton.value = 'Previous';
            prevButton.type = 'button';
            $(prevButton).prop('disabled', true);
            workRecordButtonsDiv.append(prevButton);

            prevButton.addEventListener('click', () => {
                displayWorkRecord(workRecordDiv, --index, workRecArray);
                checkButtonsForDisabling($('#btnNext'), $('#btnPrev'),
                    workRecArray.length);
            });

            nextButton.id = 'btnNext';
            nextButton.value = 'Next';
            nextButton.type = 'button';
            workRecordButtonsDiv.append(nextButton);

            nextButton.addEventListener('click', () => {
                displayWorkRecord(workRecordDiv, ++index, workRecArray);
                checkButtonsForDisabling($('#btnNext'), $('#btnPrev'),
                    workRecArray.length);
            });

            searchBox.id = 'searchBox';
            searchBox.type = 'text';
            searchButton.id = 'btnSearch';
            searchButton.type = 'button';
            searchButton.value = 'Search';
            $('#searchBarLocation').append(searchBox);
            $('#searchBarLocation').append(searchButton);

            const displayErrorMessage = message => {
                workRecordDiv.text(message);
            };

            searchButton.addEventListener('click', () => {
                const userInput = $('#searchBox').val();
                if(!$.isNumeric(userInput)) {
                    displayErrorMessage('Search term must be a number.');
                } else {
                    if(parseInt(userInput) >= workRecArray.length) {
                        displayErrorMessage('Work Record does not exist.');
                    } else {
                        index = userInput;
                        displayWorkRecord(workRecordDiv, index,
                            workRecArray);
                        checkButtonsForDisabling($('#btnNext'), $('#btnPrev'),
                            workRecArray.length);
                    }
                }
            });

            clientInvoiceElement.append(workRecordDiv);
            clientInvoiceElement.append(workRecordButtonsDiv);

            workRecordDiv = $('#workRecords');
            displayWorkRecord(workRecordDiv, 0, workRecArray);

        });
    });
});
