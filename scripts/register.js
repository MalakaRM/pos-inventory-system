const register = () => {
    const email = $('#email').val();
    const password = $('#password').val();

    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((cred) => {
            console.log(cred);
            window.location.replace("dashboard.html");
        })
        .catch((error) => {
            console.log(error);
        });
};

const alreadyHaveAccount = () => {
    window.location.replace("login.html");
};