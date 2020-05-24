function validateLogin() {
    const password = document.forms.loginform.password.value;
    if(password.length < 9) {
        alert("Password must be 8 characters or longer.");
        return false;
    }
    return true;
  }

