$(() => {
    let index = 0;
    $.get('./clients.xml', xmlData => {
        /* GETs the clients.xml file, then parses the clients to polulate
            the client selector dropdown list. Sort the options text values
            prior to appending them to the dropdown list. */
        const clients = xmlData.querySelectorAll('client');
        let optionTags = [];

        clients.forEach(client => {
            /* Create an option tag for each client, add it to an array of
                client tags */
            const optionTag = document.createElement('option');
            optionTag.value = $(client).find('id').text();
            optionTag.text = $(client).find('clientName').text();
            optionTags.push(optionTag);
        });// clients.forEach(...)

        optionTags.sort((tag1, tag2) => {
            /* Sort the elements of optionTags by option name (client name). */
            let exit = 0;

            if(tag1.text.toLowerCase() < tag2.text.toLowerCase()) {
                exit = -1;
            }

            if(tag1.text.toLowerCase() > tag2.text.toLowerCase()) {
                exit = 1;
            }

            return exit;
        });// optionTags.sort(...)

        optionTags.forEach(optionTag => {
            $('#clientSelection').append(optionTag);
        });// optionTags.forEach(...);
    });// $.get('clients.xml, ...)

    $('#clientSelection').change(() => {
        /* On client selection, grabs the clients information, work record
            information, sets up the various inputs and their event listeners.*/
        const selectedValue = $('#clientSelection').val();
        const invoiceFile =
            (parseInt(selectedValue) === 1)
            // There is no file `invoice1.xml`, so assuming invoice.xml is the
            // usual pattern for clients with the ID 1.
                ? './invoice.xml'
                : `./invoice${selectedValue}.xml`;
        index = 0;

        $.get(invoiceFile, invoiceData => {
            const workRecords = invoiceData.querySelectorAll('workRecord');
            let workRecArray = [];
            const getInvoiceValue = elementName => {
                return $(invoiceData).find(elementName).text();
            };
            // TODO: Future thought:parsing through contact information without
            // hardcoding the tag names, prevents errors if the invoice.xsd
            // file changes. Good feature if I have the time.

            // Display Client, and Contact information.
            $('#contactName').text(`Contact:
                ${getInvoiceValue('contactFirstName')}
                ${getInvoiceValue('contactLastName')}`);
            $('#clientStreet').text(getInvoiceValue('clientStreet'));
            $('#clientCity').text(`${getInvoiceValue('clientCity')},
                ${getInvoiceValue('clientProvince')}`);
            $('#clientPostalCode').text(getInvoiceValue('clientPostalCode'));
            $('#clientDiscount').text(`Discount:
                ${getInvoiceValue('clientDiscount') * 100}%`);

            // Display invoice information.
            $('#invoiceNumber').text(`Invoice:
                ${$(invoiceData).find('info').attr('invoiceNumber')}`);
            $('#invoiceDate').text(`Date: ${getInvoiceValue('invoiceDate')}`);
            $('#billRate').text(`Bill Rate: ${getInvoiceValue('billRate')}`);

            workRecords.forEach(workRecord => {
                workRecArray.push(workRecord);
            });// workRecords.forEach(...)

            workRecArray.sort((record1, record2) => {
                let exit = 0;
                if(parseInt($(record1).attr('workNumber')) <
                    $(record2).attr('workNumber')) {
                    exit = -1;
                }

                if(parseInt($(record1).attr('workNumber')) >
                    parseInt($(record2).attr('workNumber'))) {
                    exit = 1;
                }

                return exit;
            });

            // Define the "Next" button, add to DOM
            const nextButton = document.createElement('input');
            nextButton.id = 'btnNext';
            nextButton.value = 'Next';
            nextButton.type = 'button';
            $('#nextBtnLocation').html(nextButton);

            // Define the "Previous" button, add to DOM
            const prevButton = document.createElement('input');
            prevButton.id = 'btnPrev';
            prevButton.value = 'Previous';
            prevButton.type = 'button';
            $(prevButton).prop('disabled', true);
            $('#previousBtnLocation').html(prevButton);

            // Define the "Seach" textfield, add to DOM
            const searchBox = document.createElement('input');
            searchBox.id = 'txtSearch';
            searchBox.type = 'text';
            $('#txtSearchLocation').html(searchBox);

            // Define the "Seach" button, add to DOM
            const searchButton = document.createElement('input');
            searchButton.id = 'btnSearch';
            searchButton.type = 'button';
            searchButton.value = 'Search';
            $('#btnSearchLocation').html(searchButton);

            const displayWorkRecord = (workRecNum, workRecs) => {
                /* Display work record information. */
                const workRecord = workRecs[workRecNum];

                const getWorkRecordValue = element => {
                    return $(workRecord).find(element).text();
                };

                $('#workNumber').text($(workRecord).attr('workNumber'));
                $('#workDescription')
                    .text(getWorkRecordValue('workDescription'));
                $('#workDate').text(getWorkRecordValue('workDate'));
                $('#workTypeNumber').text(getWorkRecordValue('workTypeNumber'));
                $('#billedHours').text(getWorkRecordValue('billedHours'));
            };// displayWorkRecord(...)

            const checkButtonsForDisabling = (nextBtn, prevBtn, arraySize) => {
                /* Checks which work record index the user is currently at, and
                    disables the buttons when it would cause the user to
                    overflow. */
                (index === arraySize - 1)
                    ? nextBtn.prop('disabled', true)
                    : nextBtn.prop('disabled', false);

                (index === 0)
                    ? prevBtn.prop('disabled', true)
                    : prevBtn.prop('disabled', false);
            };// checkButtonsForDisabling(...)

            const displayErrorMessage = message => {
                /* I'll give you one guess what this function does. */
                $('#errorMessages').text(message);
            };// displayErrorMessage(...)

            $('#btnPrev').click(() => {
                /* Handle clicking on the "Previous" button. */
                displayWorkRecord(--index, workRecArray);
                checkButtonsForDisabling($('#btnNext'), $('#btnPrev'),
                    workRecArray.length);
            });// $('btnPrev').click(...)

            $('#btnNext').click(() => {
                /* Handle clicking on the "Previous" button. */
                displayWorkRecord(++index, workRecArray);
                checkButtonsForDisabling($('#btnNext'), $('#btnPrev'),
                    workRecArray.length);
            });// $('#btnNext').click(...)

            $('#btnSearch').click(() => {
                /* Checks users input to the seach box, and jumps to that work
                    record if it exists. */
                const userInput = $('#txtSearch').val();

                if(!$.isNumeric(userInput)) {
                    // Fails because input contains non-numbers.
                    displayErrorMessage('Search term must be a number.');
                } else {
                    if(parseInt(userInput) >= workRecArray.length) {
                        // Fails because search is greater than array.
                        // TODO: Just realized this is *NOT* what the search bar
                        // was suppose to do. It should jump to the matching
                        // work number, not the matching index number.
                        displayErrorMessage('Work Record does not exist.');
                    } else {
                        index = userInput;
                        displayWorkRecord(index, workRecArray);
                        checkButtonsForDisabling($('#btnNext'), $('#btnPrev'),
                            workRecArray.length);
                    }
                }
            });// $('#btnSearch').click(...)
            // Display the first work record on client selection.
            displayWorkRecord(0, workRecArray);
        });// $.get(invoiceFile, ...)
    });// $('#clientSelection').change(...)
});// ()
