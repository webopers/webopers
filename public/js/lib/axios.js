class Axios {
    // eslint-disable-next-line class-methods-use-this
    post = async (url, data) => {
        const myHeaders = new Headers();

        myHeaders.append('Content-Type', 'application/json');

        const raw = JSON.stringify(data);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        };
        const response = await fetch(url, requestOptions);

        return response.json();
    };
}

export default Axios;
