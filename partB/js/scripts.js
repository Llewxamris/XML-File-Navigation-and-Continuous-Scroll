(() => {
    const getXmlHttpRequest = () => { return new XMLHttpRequest(); }

    const getListOfUsers = () => {
        const PHP_ADDRESS = 'http://localhost:9000/getUsers.php';
        try {
            const xhr = getXmlHttpRequest();
            xhr.open('GET', PHP_ADDRESS);
            xhr.send();
            xhr.addEventListener('readystatechange', () => {
                if(xhr.readyState === 4) {
                    console.log(xhr.responseXML);
                }
            });
        } catch(error) {
            console.error(error);
        }
    };

    getListOfUsers();
})();
