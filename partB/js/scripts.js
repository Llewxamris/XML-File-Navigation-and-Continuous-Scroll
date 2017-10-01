(() => {
    const getXmlHttpRequest = () => { return new XMLHttpRequest(); };

    const displayUserToScreen = user => {
        /* Takes in a user XML element, creates the neccisary HTML tags, sets
         * their classes, places the XML data into the HTML tags, then appends
         * the HTML tags to the screen. */
        // #main is the only div element hardcoded inside the HTML body.
        const mainElement = document.querySelector('#main');
        // Create all the proper elements.
        const userElement  = document.createElement('div');
        const idElement = document.createElement('div');
        const nameElement = document.createElement('div');
        const firstNameElement = document.createElement('span');
        const lastNameElement = document.createElement('span');
        const cityElement = document.createElement('div');
        const countryElement = document.createElement('div');
        const emailElement = document.createElement('div');
        const genderElement = document.createElement('div');
        const petElement = document.createElement('div');
        const petColourElement = document.createElement('div');

        // Define all of the classes for the new elements. This allows for
        // more defined CSS control.
        userElement.className = 'user';
        idElement.className = 'userId';
        nameElement.className = 'userName';
        firstNameElement.className = 'userFirstName';
        lastNameElement.className = 'userLastName';
        cityElement.className = 'userCity';
        countryElement.className = 'userCountry';
        emailElement.className = 'userEmail';
        genderElement.className = 'userGender';
        petElement.className = 'userPet';
        petColourElement.className = 'userPetColour';

        // Set the text of the elements to the value of their counterparts
        // inside the user XML element.
        idElement.innerText = user.querySelector('id').firstChild.nodeValue;
        firstNameElement.innerText =
            user.querySelector('firstName').firstChild.nodeValue;
        lastNameElement.innerText =
            user.querySelector('lastName').firstChild.nodeValue;
        cityElement.innerText = user.querySelector('city').firstChild.nodeValue;
        countryElement.innerText =
            user.querySelector('country').firstChild.nodeValue;

        // Email can be empty, must check for this.
        if (user.querySelector('email').firstChild !== null) {
            emailElement.innerText =
                user.querySelector('email').firstChild.nodeValue;
        } else {
            emailElement.innerText = 'No email specified';
        }

        genderElement.innerText =
            user.querySelector('gender').firstChild.nodeValue;
        petElement.innerText = user.querySelector('pet').firstChild.nodeValue;
        petColourElement.innerText =
            user.querySelector('petColour').firstChild.nodeValue;

        // Add the two name elements to a super name element.
        nameElement.appendChild(firstNameElement);
        nameElement.innerHTML += '&nbsp;';
        nameElement.appendChild(lastNameElement);

        // Add all users elements to a super user element.
        userElement.appendChild(idElement);
        userElement.appendChild(nameElement);
        userElement.appendChild(cityElement);
        userElement.appendChild(countryElement);
        userElement.appendChild(emailElement);
        userElement.appendChild(genderElement);
        userElement.appendChild(petElement);
        userElement.appendChild(petColourElement);

        // Add the user element to the HTML page.
        mainElement.appendChild(userElement);
    };// displayUserToScreen(...)

    const getListOfUsers = (startingRecord) => {
        const phpAddress =
            `http://localhost:9000/getUsers.php?sr=${startingRecord}&c=50`;
        try {
            const xhr = getXmlHttpRequest();
            xhr.open('GET', phpAddress);
            xhr.send();
            xhr.addEventListener('readystatechange', () => {
                if(xhr.readyState === 4) {
                    const users = xhr.responseXML.querySelectorAll('user');
                    const main = document.querySelector('#main');
                    if (users.length !== 0) {
                        main.innerHTML = '';
                        users.forEach(user => {
                            displayUserToScreen(user);
                        });
                    }
                }
            });// xhr.addEventListener(...)
        } catch(error) {
            alert(`Sorry, something has gone wrong. Please try again
            in a moment. \n${error}`);
        }
    };// getListOfUsers(...)

    document.addEventListener('scroll', () => {
        const mainElement = document.querySelector('#main');
        // Catch if user has scrolled to the top of the page.
        if (window.scrollY === 0) {
            const startingId = parseInt(
                mainElement.querySelectorAll('.userId')[0].innerText) - 25;

            if (startingId >= 1) {
                getListOfUsers(startingId);
            }
        }

        // Catch if user has scrolled to the bottom of the page.
        if ((window.innerHeight + window.scrollY) >=
            document.body.offsetHeight) {
            const userIdElems = mainElement.querySelectorAll('.userId');
            const endingId = parseInt(
                userIdElems[userIdElems.length - 1].innerText) + 1;
            getListOfUsers(endingId);
        }
    });// document.addEventListener('scroll', ...)

    getListOfUsers(1);
})();
